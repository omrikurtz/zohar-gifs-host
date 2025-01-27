import { OpenAI } from "openai";
import * as cheerio from "cheerio";
import * as fs from "fs";
import { readFile } from "node:fs/promises";
import {imageDimensionsFromStream} from "image-dimensions";
import 'dotenv/config'

import * as readline from "readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const prompt = (query: any): Promise<string> => new Promise((resolve) => rl.question(query, resolve));


const credentials = Buffer.from("wrdprs7000@gmail.com:arFc sBMv RoH6 qcBq Hw5d TyDo").toString("base64");

const generateArticle = async (
    brand: string,
    affiliateLink: string,
    images: string[],
    enrichmentData: string
): Promise<string> => {
    const openai = new OpenAI({
        organization: "org-dePj8HFXvxvA6fTm1xXUjshJ",
        project: "proj_rUzgIEsUYWUIAc8yW7Nkw36I",
    });

    const command = `
        Generate an engaging and energetic blog post for the company ${brand}.
        Make sure to not write it as if we're the company, but as if we're a third party writing about them.
        Here is an overview from Google snippets of the brand, use it (wisely) when writing the article:
        ${enrichmentData}
        
        RULES:
        a. You MUST write only the blog and nothing else.
        b. You MUST write the blog post in HTML format to be uploaded to Wordpress via the /wp-json/wp/v2/posts API. This means using <p> tags, <a> tags and bolding whenever appropriate. Style it accordingly with titles and so on.
        c. Use the following images between paragraphs.
        ${images.map((image, index) => `${index+1}. <img src="${image}" />`).join("\n")}
        d. Make the article at least 7-8 paragraphs long, each paragraph should be equal to or larger than 8 sentences.
        e. Do not be lazy and write in great detail. Separate to subtitles and sections. Add a call to action at the end of the article.
        f. Whenever mentioning name ${brand}, use my affiliate link ${affiliateLink}. Don't do it on the article title. The images themselves should also href the affiliate link.
        h. Give only the <body> part of the HTML, I will take care of the rest.
        i. In the end of the body, include a <category> element which use category tags that are relevant to the brand.
            the categories should be written in this format: <category>48,24,...</category>
            Here is a mapping of tag number to value (use the numbers in <category>...</category>)
            32: Beauty
            5: Fashion
            7: Health
            4: Lifestyle
            54: Tech
            8: Travel
        j. Same as above, but for tags, use the <tags> element for this. Add maximum 3 tags.
            Here is a mapping of tag number to value (use the numbers in <tags>...</tags>)
            48: Accessories
            29: Beauty
            52: Affordable
            61: Body
            37: Clothing
            58: Connect
            38: Cooking
            171: Discounts
            53: Donation
            57: Adventure
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            {
                role: "system",
                content: "You are a blog generator, specialized in Wordpress blog generation with HTML."
            },
            {
                role: "user",
                content: `${command}`
            }
        ],
        temperature: 1,
    });
    return response.choices[0].message.content ?? "";
}

async function getGoogleImages(brand: string) {
    const header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36"
    };
    const googleImagesResponse = await fetch(
        `https://www.google.com/search?q=${brand}&udm=2&biw=1728&bih=958&dpr=2`,
        { headers: header }
    );
    const googleImagesData = await googleImagesResponse.text();
    const $ = cheerio.load(googleImagesData);
    
    console.log("Number of elements found:", $("h3.ob5Hkd a").length);
    $("h3.ob5Hkd a").each((_, el) => {
        console.log("Element:", $(el).prop('outerHTML'));
        console.log("Href:", $(el).attr('href'));
    });

    const imageUrls = $("h3.ob5Hkd a")
        .map((_, el) => {
            const href = $(el).attr('href');
            if (!href) return null;
            
            const urlParams = new URLSearchParams(href.replace('/url?', ''));
            const imageUrl = urlParams.get('imgurl');
            return imageUrl ? decodeURIComponent(imageUrl) : null;
        })
        .get()
        .filter((url): url is string => 
            url !== null && 
            (url.includes(".png") || url.includes(".jpg") || url.includes(".jpeg"))
        )
        .slice(0, 20);

    const landscapeImages = await Promise.all(imageUrls.map(async (imageUrl) => {
        try {
            const imageResponse = await fetch(imageUrl);
            let { body } = imageResponse;
            body = body!!;
            const dimensions = await imageDimensionsFromStream(body) ?? {width: 0, height: 0};
            return {
                mode: dimensions.width > dimensions.height ? "landscape" : "portrait",
                imageUrl
            };
        } catch (error) {
            console.error("Error fetching image dimensions:", error);
            return null;
        }
    }));

    return {
        landscapeImages: landscapeImages.filter((image) => image?.mode === "landscape").map((image) => image?.imageUrl),
        portraitImages: landscapeImages.filter((image) => image?.mode === "portrait").map((image) => image?.imageUrl),
    };
}

async function getImagesFromSite(brandURL: string) {
    let header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36"
    };
    let response = await fetch(
        `https://${brandURL}`,
        {
            headers: header
        }
    );
    let raw = await response.text();
    const $ = cheerio.load(raw);
    const results = $("img").map((i, el) => {
        return $(el).attr('src');
    }).get();

    return results.slice(0,4);
}

async function getBrandSnippet(brand: string) {
    let header =    {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36"
    };
    let googleSearchResponse = await fetch(
        `https://www.google.com/search?q=${brand}&rlz=1C5GCCM_en&oq=gpt+browse+api&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIICAIQABgWGB4yCAgDEAAYFhgeMggIBBAAGBYYHjIICAUQABgWGB4yCAgGEAAYFhgeMggIBxAAGBYYHjIICAgQABgWGB4yCAgJEAAYFhge0gEIMjk2NGowajeoAgCwAgA&sourceid=chrome&ie=UTF-8`,
        {
            headers: header
        }
    );
    let googleSearchData = await googleSearchResponse.text();
    const $ = cheerio.load(googleSearchData);
    // might break, but works for now :)
    const results = $(".VwiC3b.yXK7lf").map((_, el) => {
        return $(el).text();
    }).get();
    return results.join("\n");
}

function parseArticle(article: string) {
    const $ = cheerio.load(article);
    const title = $("h1").text();
    const categories = $("category").text().split(",").map((cat) => parseInt(cat));
    const tags = $("tags").text().split(",").map((tag) => parseInt(tag));
    const body = $("body").html()?.replace(/<h1>.*?<\/h1>/, '')?.replace(/<tags>.*?<\/tags>/, '').replace(/<category>.*?<\/category>/, '') ?? "";
    return { title, body, categories, tags };
}

async function uploadFeaturedMedia(imagePath: string, brand: string) {
    const form = new FormData();
    const file = await readFile(imagePath);
    const blob = new Blob([file], { type: "image/jpeg" });
    form.append('file', blob, `featured-image-${brand}.jpg`);
    const response = await fetch("https://guru-lifestyle.com/wp-json/wp/v2/media", {
        method: "POST",
        headers: {
            "Authorization": `Basic ${credentials}`,
        },
        body: form,
    });
    const jsonResponse = (await response.json() as any);
    console.log(jsonResponse);
    return jsonResponse?.id;
}


async function downloadGooglePhoto(url: string, path: string) {
    const response = await fetch(url);
    const ab = await response.arrayBuffer();
    const buffer = Buffer.from(ab);
    fs.writeFileSync(path, buffer);
}

!(async () => {
    const brand = await prompt("Enter brand name: ");
    const brandURL = await prompt("Enter brand URL: ");
    const affiliateLink = await prompt("Enter affiliate link: ");
    console.log(`Getting images for ${brand}...`)
    let imageURLs = await getGoogleImages(brandURL);
    let landscapeImages = imageURLs.landscapeImages;
    if (landscapeImages.length === 0) {
        console.log("No landscape images found, trying with brand name instead of URL...");
        imageURLs = await getGoogleImages(brand);
        landscapeImages.push(...imageURLs.landscapeImages);
    }
    const allImages = [...landscapeImages, ...imageURLs.portraitImages];
    console.log("Images; ", allImages);
    console.log(`Getting snippet for ${brand}...`);
    const snippet = await getBrandSnippet(brandURL);
    console.log("Snippet: ", snippet);
    console.log("Generating article...");
    let article = await generateArticle(brand, affiliateLink, allImages.slice(1,3), snippet);
    const { title, body, categories, tags } = parseArticle(article);
    const imagePath = "featured.jpg";
    console.log("Downloading featured photo...");
    await downloadGooglePhoto(landscapeImages[0] ?? allImages[0], imagePath);
    console.log("Uploading featured photo, this might take a few seconds...");
    const featuredMediaId = await uploadFeaturedMedia(imagePath, brand);

    let response = await fetch("https://guru-lifestyle.com/wp-json/wp/v2/posts", {
        headers: {
            "Authorization": `Basic ${credentials}`,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            title: title,
            content: body,
            status: "draft",
            featured_media: featuredMediaId,
            categories: categories,
            tags: tags
        }),
    });
    console.log(await response.json());
})();