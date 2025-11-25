import { useState, useEffect } from "react";
import "../pages/WYR.css"
const questions = [
    "What is one thing you’ve never told anyone?",
    "When do you feel most like yourself?",
    "What’s a fear you’ve recently overcome?",
    "Who has shaped you the most in your life?",
    "What do you value most in a friendship?",
    "When was the last time you felt truly at peace?",
    "What is a dream you’ve given up on?",
    "How do you handle disappointment?",
    "What does love mean to you?",
    "What is something you wish people understood about you?",
    "When do you feel most vulnerable?",
    "What is a habit you want to break?",
    "How do you define success?",
    "What’s one thing you regret not doing?",
    "How do you react to criticism?",
    "Who do you turn to when you’re struggling?",
    "What’s one thing you’d change about your past?",
    "When do you feel most alive?",
    "What is a secret talent you have?",
    "What scares you most about the future?",
    "What’s one thing you’re proud of yourself for?",
    "How do you show love to others?",
    "When do you feel the most alone?",
    "What’s something you’ve never forgiven yourself for?",
    "Who has hurt you the most, and why?",
    "What is a memory that still makes you smile?",
    "When do you feel most misunderstood?",
    "What’s a risk you wish you had taken?",
    "How do you define happiness?",
    "What is one thing you’d like to be remembered for?",
    "When do you feel most judged?",
    "What is a lie you’ve told to protect someone else?",
    "What’s the most difficult conversation you’ve had?",
    "How do you cope with anger?",
    "When do you feel most confident?",
    "What’s something you struggle to express?",
    "Who inspires you, and why?",
    "What is your biggest insecurity?",
    "When do you feel the most connected to someone?",
    "What is one thing you would tell your younger self?",
    "How do you handle being alone?",
    "What is a lesson you learned the hard way?",
    "What’s something you wish you could say to someone but haven’t?",
    "What’s your favorite way to be comforted?",
    "What is a moment you wish you could relive?",
    "How do you know when to trust someone?",
    "What is one thing you’re afraid of admitting?",
    "What’s a small thing that always makes your day better?",
    "When do you feel most proud of yourself?",
    "What is a boundary you’ve learned to set?",
    "What’s one thing you want to experience before you die?",
    "What’s a belief you’ve held for a long time that has changed recently?",
    "When was the last time you cried and why?",
    "What part of yourself do you hide from the world?",
    "What does failure mean to you?",
    "When do you feel like you’re pretending to be someone else?",
    "What’s a recurring thought or worry you can’t shake?",
    "What is the hardest truth you’ve had to accept about yourself?",
    "Who in your life do you feel you’ve disappointed the most?",
    "What is a shame you carry, and how does it affect you?",
    "When do you feel the most alive and the most scared at the same time?",
    "What’s a lesson about love that you’re still learning?",
    "How do you handle feelings of jealousy or envy?",
    "What’s a pattern in your relationships you keep repeating?",
    "What’s a secret fear you’ve never admitted to anyone?",
    "When have you felt the most betrayed?",
    "What is a vulnerability you’ve learned to embrace?",
    "What is something you can’t forgive yourself for yet?",
    "What does intimacy mean to you beyond the physical?",
    "When have you felt completely misunderstood, and by whom?",
    "What is a limit you’ve set for yourself that you wish you could break?",
    "What is a memory that still haunts you?",
    "When do you feel truly seen by someone?",
    "What’s a part of your identity you’ve only recently accepted?",
    "What is the hardest boundary you’ve ever had to enforce?",
    "When have you felt powerless, and how did you respond?",
    "What is a loss that changed you permanently?",
    "When do you feel the most conflicted about your choices?",
    "What’s a self-deception you used to believe?",
    "What part of your past are you still learning to reconcile with?",
    "When have you felt the most courage, and what did it cost you?",
    "What’s a habit or coping mechanism that no longer serves you?",
    "When have you felt truly proud of someone else and not yourself?",
    "What is a question you’ve been afraid to ask yourself?",
    "When do you feel the most authentic, and what triggers it?",
    "What is the hardest thing you’ve had to let go of?",
    "When have you felt gratitude in a moment of pain?",
    "What’s a part of your personality you wish you could change?",
    "When have you experienced unconditional love, and how did it feel?",
    "What does forgiveness look like for you?",
    "When have you felt the most abandoned, and how did you cope?",
    "What’s a truth about yourself you hide even from your closest friends?",
    "When do you feel the most connected to the universe or a higher purpose?",
    "What’s a fear about yourself you think no one else would understand?",
    "When have you experienced pure joy, and what caused it?",
    "What’s a secret hope or dream you’re scared to pursue?",
    "When do you feel most at peace with your imperfections?",
    "What’s an assumption you often make about others that isn’t true?",
    "When have you felt your own resilience most deeply?",
    "What is a boundary you wish you had the strength to enforce more consistently?",
    "What does sexual intimacy mean to you beyond physical pleasure?",
    "When do you feel most desired and most rejected?",
    "What’s a fantasy you’ve never shared with anyone?",
    "How do you express love and desire differently?",
    "When have you felt truly vulnerable during sex or intimacy?",
    "What’s a boundary you’ve struggled to communicate in intimate situations?",
    "How do you distinguish between emotional connection and physical attraction?",
    "When have you felt emotionally unsafe with a partner?",
    "What is a desire you’re afraid to admit even to yourself?",
    "How do you feel about your body and how it affects your intimacy?",
    "When do you feel the most connected to a partner during sex?",
    "What’s a past experience that shaped how you approach intimacy today?",
    "How do you navigate sexual expectations versus your own desires?",
    "What’s a time you felt ashamed or embarrassed in an intimate situation?",
    "How do you communicate your needs in a sexual relationship?",
    "What role does trust play in your intimate relationships?",
    "When have you felt misunderstood sexually or emotionally by a partner?",
    "How do you experience vulnerability differently in sexual versus emotional intimacy?",
    "What does consent look like to you beyond a simple yes or no?",
    "What’s a lesson about intimacy you’ve learned the hard way?",
    "When do you feel the most free to explore your sexuality?",
    "How do you balance intimacy with personal boundaries?",
    "What’s a fantasy or experience you’ve always wanted to try but never have?",
    "How do past relationships affect your current approach to intimacy?",
    "When have you felt the most emotionally exposed in a sexual relationship?",
    "What is a fear you have about being intimate with someone new?",
    "How do you recover from feeling rejected or disconnected during intimacy?",
    "When do you feel fully accepted by a partner, both sexually and emotionally?",
    "What’s a form of intimacy you crave but rarely receive?",
    "How do you express your sexual identity in your relationships?",
    "What is a desire you’ve suppressed to please a partner or society?",
    "When do you feel the most confident and the most insecure in intimate moments?",
    "How do you differentiate between love, lust, and attachment?",
    "What’s a sexual or intimate boundary you’ve had to defend recently?",
    "How does your upbringing influence how you approach intimacy and sex?",
    "When do you feel most comfortable being vulnerable in bed?",
    "What is a misconception people often have about your sexuality?",
    "How do you feel about giving and receiving pleasure equally?",
    "What’s a sexual or intimate experience that changed how you see yourself?",
    "When have you felt disconnected from your partner during intimacy, and why?",
    "How do you communicate consent, pleasure, and limits with a partner?"
];

export default function WouldYouRather() {
    const [questionList, setQuestionList] = useState([...questions]);
    const [question, setQuestion] = useState("");

    const newQuestion = () => {
        if (questionList.length === 0) {
            setQuestion("No more questions!");
            return;
        }
        const randomIndex = Math.floor(Math.random() * questionList.length);
        setQuestion(questionList[randomIndex]);
    };


    useEffect(() => {
        newQuestion();
    }, [questionList]);

    return (
        <div className="would-you-rather-container">
            <div className="question-box">{question}</div>
            <div style={{ display: "flex", gap: "15px" }}>
                <button onClick={newQuestion} className="new-question-btn">
                    New Question
                </button>
            </div>
        </div>
    );
}
