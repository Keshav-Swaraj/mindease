// src/pages/ResourcesPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

import ArticleCard from '../components/ArticleCard';
import FaqItem from '../components/FaqItem';
import HelpCard from '../components/HelpCard';

// Import your placeholder images
import anxietyImg from '../assets/article-anxiety.jpg';
import meditationImg from '../assets/article-meditation.jpg';
import sleepImg from '../assets/article-sleep.jpg';

// Dummy data for the page
const articlesData = [
  { tag: 'Anxiety', image: anxietyImg, title: 'Understanding Anxiety and Its Management', description: 'Learn about the different types of anxiety disorders, their symptoms, and effective management strategies.', readTime: '8 min' },
  { tag: 'Meditation', image: meditationImg, title: 'The Benefits of Mindfulness Meditation', description: 'Discover how mindfulness meditation can reduce stress, improve focus, and enhance overall well-being.', readTime: '6 min' },
  { tag: 'Sleep', image: sleepImg, title: 'Building Healthy Sleep Habits', description: 'Essential tips for improving sleep quality and establishing a consistent sleep routine for better mental health.', readTime: '7 min' },
];

const faqData = [
  { question: 'How can AI help with my mental health?', answer: 'AI companions like Mindy provide a safe, non-judgmental space for you to express your feelings 24/7. They can help identify patterns in your mood, suggest wellness activities, and offer support whenever you need it.' },
  { question: 'What are the signs of burnout?', answer: 'Common signs include emotional exhaustion, cynicism or detachment from your job, and a sense of reduced personal accomplishment. It\'s important to recognize these signs early and take steps to address them.' },
  { question: 'How do I find a therapist?', answer: 'You can start by asking your primary care doctor for a referral, checking with your insurance provider for in-network professionals, or using online directories like Psychology Today or the American Psychological Association.' },
];

const helpData = [
    { title: 'National Crisis and Suicide Lifeline', description: 'Available 24/7', tag: 'Crisis Support', number: '988' },
    { title: 'Crisis Text Line', description: 'Text HOME to 741741', tag: 'Text Support', number: '741741' },
    { title: 'SAMHSA National Helpline', description: 'Treatment referral service', tag: 'Treatment Referral', number: '1-800-662-4357' },
    { title: 'National Alliance on Mental Illness', description: 'Support and resources', tag: 'Information & Support', number: '1-800-950-6264' },
]

const ResourcesPage = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Header Section */}
      <section className="text-center">
        <h1 className="text-5xl font-extrabold">Additional Resources & Support</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-white/70">
          Explore a variety of resources to support your mental health journey. Find articles, FAQs, and links to professional help and community forums.
        </p>
      </section>

      {/* Articles Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articlesData.map(article => <ArticleCard key={article.title} {...article} />)}
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {faqData.map(faq => <FaqItem key={faq.question} {...faq} />)}
        </div>
      </section>

      {/* Professional Help Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Professional Help</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {helpData.map(help => <HelpCard key={help.title} {...help} />)}
        </div>
      </section>

      {/* Community Forums CTA */}
      <section className="max-w-6xl mx-auto bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-center">
        <h2 className="text-3xl font-bold">Community Forums</h2>
        <p className="mt-4 text-white/70 max-w-2xl mx-auto">Connect with others who are on a similar journey. Share your experiences, ask questions, and find support in our community forums.</p>
        <Link to="#" className="mt-6 inline-block bg-gradient-to-r from-brand-blue-light to-brand-purple-dark text-white font-semibold px-8 py-3 rounded-full">
            Join the Community
        </Link>
      </section>

    </div>
  );
};

export default ResourcesPage;