import { OpenAI } from "openai";
import * as cheerio from "cheerio";
import * as fs from "fs";
import { readFile } from "node:fs/promises";
import {imageDimensionsFromStream} from "image-dimensions";
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
        i. In the end of the body, include a <tags> element which use tags that are relevant to the brand.
            the tags should be written in this format: <tags>48,24,...</tags>
            Here is a mapping of tag number to value (use the numbers in <tags>...</tags>)
            32: Beauty
            5: Fashion
            7: Health
            4: Lifestyle
            54: Tech
            8: Travel
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
    let header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36"
    };
    let googleImagesResponse = await fetch(
        `https://www.google.com/search?q=${brand}&hl=en&tbm=isch&asearch=ichunk&async=_id:rg_s,_pms:s,_fmt:pc&sourceid=chrome&ie=UTF-8`,
        {
            headers: header
        }
    );
    let googleImagesData = await googleImagesResponse.text();
    const $ = cheerio.load(googleImagesData);
    const results = $("div.rg_meta.notranslate").map((i, el) => {
        return $(el).text();
    }).get();
    const imageUrls = results.map((result) => JSON.parse(result).ou).slice(0,20);
    const landscapeImages = await Promise.all(imageUrls.map(async (imageUrl) => {
        try {
            const imageResponse = await fetch(imageUrl);
            let { body } = imageResponse;
            body = body!!;
            const dimensions = await imageDimensionsFromStream(body) ?? {width: 0, height: 0};
            if (dimensions.width > dimensions.height) {
                return { mode: "landscape", imageUrl};
            } else {
                return {mode : "portrait", imageUrl};
            }
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
    const tags = $("tags").text().split(",").map((tag) => parseInt(tag));
    const body = $("body").html()?.replace(/<h1>.*?<\/h1>/, '')?.replace(/<tags>.*?<\/tags>/, '');
    return { title, body, tags };
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
    const brand = process.argv[2];
    const brandURL = process.argv[3]
    const affiliateLink = process.argv[4];
    console.log(`Getting images for ${brand}...`)
    const imageURLs = await getGoogleImages(brandURL);
    const landscapeImages = imageURLs.landscapeImages;
    const allImages = [...landscapeImages, ...imageURLs.portraitImages];
    console.log(`Getting snippet for ${brand}...`);
    const snippet = await getBrandSnippet(brandURL);
    console.log("Generating article...");
    let article = await generateArticle(brand, affiliateLink, allImages.slice(1,3), snippet);
    const { title, body, tags } = parseArticle(article);
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
            categories: tags,
        }),
    });
    console.log(await response.json());
})();