// @ts-nocheck

import { useState, useEffect } from 'react';
import { Check, X, Brain, ChefHat } from 'lucide-react';

const MenuMemoryGame = () => {
    const data = {
        "menuItems": [
            {
                "name": "סלט שורש",
                "ingredients": "מלפפון, פקאן מסוכר, מקלוני שקדים, כרוב סגול, קולורבי, מיקס גזרים צבעוניים, אספרגוס, בצל ירוק, לב חסה. רוטב צ׳ילי מתוק, סויה, חמאת בוטנים, כוסברה, שום, לימון, טוגראשי, שמן זית"
            },
            {
                "name": "סלט פאפאיה",
                "ingredients": "רצועות פאפאיה, עגבניות שרי מיובשות, בוטנים, טוביקו אורז. רוטב פיש סוס, צ׳ילי, שום, תמרין, מיץ לימון"
            },
            {
                "name": "גרין ווסאבי",
                "ingredients": "חסה אייס, חסה סלנובה, חסה לליק, אנדיב, אפונת וואסבי, פיצוחי ווסאבי, קשיו מסוכר. רוטב שמן זית, שמן זרעי ענבים, שמן שומשום, אבקת וואסבי, דבש, מיץ לימון, יוזו, מלח"
            },
            {
                "name": "סלט פאן סי",
                "ingredients": "איטריות זכוכית (איטריות שעועית), טופו, גזר, קולורבי, כרוב סגול, מלפפון, בצל שלוט, נענע, כוסברה, ג׳ינג׳ר, בוטנים מסוכרים גרוסים. רוטב סויה, מירין, מייפל, לימון, מיונז יפני, שום, ג׳ינג׳ר, שמן שומשום, שמן זית, מלח פלפל שחור גרוס"
            },
            {
                "name": "חציל צ׳אנג צ׳ה",
                "ingredients": "חציל אסייתי מאודה, בצל ירוק, כרישה, אצות ים מטוגנות. רוטב סויה, לימון, ג׳ינג׳ר, שום ובצל ירוק"
            },
            {
                "name": "טאטאקי בקר",
                "ingredients": "פרוסות בקר במידת עשייה m, רצועות ג׳ינג׳ר מטוגנות, שמן שומשום, צ׳ילי חריף, בצל ירוק. רוטב פונזו"
            },
            {
                "name": "ספייסי אדממה",
                "ingredients": "פולי סויה עם קליפה, שומשום שחור ולבן. רוטב שום צ׳ילי חריף סוכר"
            },
            {
                "name": "טרטר בקר",
                "ingredients": "פילה בקר קצוץ, מלפפון קצוץ, בצלי שלוט, כוסברה, צ׳ילי חריף, על קריספי רייס. רוטב פיש סוס, מיץ לימון, סוכר חום, גינגר, טוגראשי, סויה, שמן שומשום"
            },
            {
                "name": "סביצ׳ה דג לבן",
                "ingredients": "דג לבן (דניס), בצלי שלוט, צ׳ילי חריף, בצל ירוק, טוביקו על חסה לליק ודפי נורי פריחים. רוטב רכז רימונים, שמן זית, יוזו, פלפל שחור גרוס, מלח, ג׳ינג׳ר, מייפל"
            },
            {
                "name": "טאטאקי טונה",
                "ingredients": "טאטאקי של טונה, פלפל חלפיניו, כוסברה, בצל ירוק, שן זית ומלח, פרי הדר. רוטב פונזו (מיץ לימון, חומץ, סויה, מירין)"
            },
            {
                "name": "מרק מיסו עם כיסוני ירקות וטופו",
                "ingredients": "ציר דשי, מיסו (מחית שעועית), סויה, סאקה (יין אורז), אצות ים, טופו, דאמפלינגס ירקות"
            },
            {
                "name": "נאמס צ׳ה יו",
                "ingredients": "דפי אורז, פרגית, גזר, פטריות עץ, אטריות שעועית, מלח, פלפל. מגיע עם חסה לליק, נענע, כוסברה וצ׳ילי סלייס. רוטב פיש סוס צילי שום"
            },
            {
                "name": "אנטרי קוטו",
                "ingredients": "פרוסות דקות של אנטריקוט פרימיום, אספרגוס, בצל ירוק. רוטב סויה, מירין (ליקר אורז מתקתק) שום, טריאקי תפוח, שמן שומשום, שומשום לבן, צילי קוריאני, בצל לבן, סוכר"
            },
            {
                "name": "גיוזה",
                "ingredients": "פרגית, גזר, כרוב, בצל ירוק, גינגר, פלפל לבן. רוטב פונזו"
            },
            {
                "name": "דאמפלינגס הא קאו",
                "ingredients": "בצק קמח טפיוקה עם מילוי שרימפס מאודים. רוטב סויה, מירין, חומץ אורז, צילי טוגראשי, שומשום לבן ושחור, שום, ג׳ינג׳ר"
            },
            {
                "name": "דרגון בול",
                "ingredients": "שרימפס קצוץ, שורש לוטוס, פלפל לבן, ג׳ינג׳ר במעטפת דפי קמח מטוגנים. רוטב ספייסי מיונז"
            },
            {
                "name": "כדורי פנינה",
                "ingredients": "פרגית, כוסברה, שום, ג׳ינג׳ר, ביצה, מלח פלפל, סויה, מצופה בסטיקי רייס. רוטב סויה, חומץ אורז, שום, צ׳ילי, סוכר, שמן שומשוום"
            },
            {
                "name": "פאן מי טונה",
                "ingredients": "לחם קסטן קלוי, אבוקדו, פטריות שיטאקי, טוביקו שחור וספייסי מיונז. רוטב סויה, מירין, חומץ, צ׳ילי קוריאני, שמן שומשום"
            },
            {
                "name": "באן אסאדו",
                "ingredients": "בשר אסאדו מפורק, סויה, סוכר, בצל לבן, שום, קינמון, כוכבי אניס, עלי דפנה, פלפל אנגלי, גלנגה (ג׳ינג׳ר יבש), ציפורן, מלח. מגיע עם רוטב ספייסי מיונז וחסה לליק בתוך הבאן"
            },
            {
                "name": "יאקיטורי סאטה סטיקי רייס",
                "ingredients": "פרגית, סטיקי רייס, חמאת בוטנים, חלב קוקוס, קארי אדום, צ׳ילי גרוס, שום, סוכר, בוטנים"
            },
            {
                "name": "פילה zo",
                "ingredients": "נתחי פילה בקר, אספרגוס צרוב. רוטב סויה, מירין, סאקה, מיץ ג׳ינג׳ר, שומשום שחור לבן"
            },
            {
                "name": "סלמון בבר בלאן",
                "ingredients": "פילה סלמון, אורז אדום, בייבי תרד. רוטב שמנת, חמאה, לימון, קאוויאר, טוביקו שחור"
            },
            {
                "name": "בלק קוד",
                "ingredients": "פילה דג בלק קוד, רוטב מיסו, סאקה, אורז צרוב. רוטב סויה, מיסו, מירין, ג׳ינג׳ר, סאקה"
            },
            {
                "name": "לוקוס מאודה עם ציר דשי ירקות",
                "ingredients": "דג לוקוס מאודה, זוקיני, על חלב קוקוס וקארי ירוק"
            },
            {
                "name": "מרק איטריות סובה עם וואן טון דג ים ושרימפס מטוגן בדפי אורז",
                "ingredients": "אטריות מחיטה מלאה, דג לבן, ג׳ינג׳ר, בצל ירוק, פלפל לבן, כרישה, שרימפס בטמפורה. רוטב סויה, מירין, ציר דגים, סאקה, דשי"
            },
            {
                "name": "סטייק טופו עם ירקות שורש",
                "ingredients": "טופו ברוטב טריאקי בתנור, ירקות שורש (מלפפון, כרוב סגול, קולורבי, גזר, אספרגוס, בצל ירוק). רוטב אריאקי, חמאת בוטנים, סויה, צ׳ילי מתוק"
            },
            {
                "name": "ליידי פנקוטה",
                "ingredients": "פנקוטה ורדים, קולי דה קסיס, טוויל שקדים, פירות יער"
            },
            {
                "name": "מי קווי שוקלוד",
                "ingredients": "שוקולד, ג׳לטו מיסו, קקאו גרוס"
            },
            {
                "name": "צ׳יז ליפס",
                "ingredients": "ציפוי שוקולד לבן ומאצ׳ה, אנגלז קוקוס, קרמבל קרם מסקרפונה במעטפת שוקולד לבן עם מאצ׳ה"
            },
            {
                "name": "ברולה תירס",
                "ingredients": "שטרויזל שקדים, גלידת תירס לבן, מיאסי פריך"
            },
            {
                "name": "טפיוקה קוקוס",
                "ingredients": "טפיוקה, חלב קוקוס, למון גרס, פרי, סורבה קוקוס, קוקוס קלוי"
            }
        ]
    }
    const [currentDish, setCurrentDish] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [isRevealed, setIsRevealed] = useState(false);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [menuItems, setMenuItems] = useState([{
        name: "",
        ingredients: ""
    }]);

    useEffect(() => {
        // In a real app, this would be fetched from an API
        setMenuItems(data.menuItems);
        pickRandomDish(data.menuItems);
    }, []);

    const pickRandomDish = (items) => {
        const randomIndex = Math.floor(Math.random() * items.length);
        setCurrentDish(items[randomIndex]);
        setIsRevealed(false);
        setUserInput('');
    };

    const handleReveal = () => {
        setIsRevealed(true);
        setScore(prev => ({
            correct: prev.correct + (userInput.trim().toLowerCase() === currentDish.ingredients.trim().toLowerCase() ? 1 : 0),
            total: prev.total + 1
        }));
    };

    const handleNext = () => {
        pickRandomDish(menuItems);
    };

    if (!currentDish) return null;

    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

    return (
        <div className="max-w-4xl mx-auto p-2 space-y-4">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-colors">
                {/* Header */}
                <div className="p-4 border-b dark:border-gray-700 relative">
                    <p className="text-xl font-bold text-center flex items-center justify-center gap-2 dark:text-white">
                        <ChefHat className="w-6 h-6" />
                        <span>Menu Memory Game</span>
                        <Brain className="w-6 h-6" />
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Score Display */}
                    <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Score: {score.correct}/{score.total}</div>
                        <div className="text-lg font-semibold dark:text-white">
                            Accuracy: {accuracy}%
                        </div>
                    </div>

                    {/* Current Dish */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2 dark:text-white">{currentDish.name}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Can you remember the ingredients?</p>
                    </div>

                    {/* Input Area */}
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type the ingredients here..."
                        className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
                     resize-none transition-colors"
                        disabled={isRevealed}
                    />

                    {/* Buttons */}
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleReveal}
                            disabled={isRevealed || !userInput.trim()}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors
                ${isRevealed || !userInput.trim()
                                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                        >
                            Reveal Answer
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!isRevealed}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors
                ${!isRevealed
                                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 text-white'}`}
                        >
                            Next Dish
                        </button>
                    </div>

                    {/* Answer Reveal */}
                    {isRevealed && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors">
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 dark:text-white">
                                    {userInput.trim().toLowerCase() === currentDish.ingredients.trim().toLowerCase() ? (
                                        <Check className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <X className="w-5 h-5 text-red-500" />
                                    )}
                                    Correct Answer:
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">{currentDish.ingredients}</p>
                            </div>
                            {userInput.trim().toLowerCase() !== currentDish.ingredients.trim().toLowerCase() && (
                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors">
                                    <h3 className="text-lg font-semibold mb-2 dark:text-white">Your Answer:</h3>
                                    <p className="text-gray-700 dark:text-gray-300">{userInput}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuMemoryGame;