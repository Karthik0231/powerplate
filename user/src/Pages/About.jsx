import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutUs() {
  // CSS styles defined directly
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      color: '#333'
    },
    section: {
      marginBottom: '60px'
    },
    sectionTitle: {
      fontSize: '28px',
      borderBottom: '2px solid #3498db',
      paddingBottom: '10px',
      marginBottom: '25px',
      color: '#2c3e50'
    },
    storyText: {
      fontSize: '16px',
      lineHeight: '1.7',
      marginBottom: '20px'
    },
    mission: {
      backgroundColor: '#f8f9fa',
      padding: '30px',
      borderRadius: '8px',
      border: '1px solid #e9ecef',
      marginBottom: '40px'
    },
    missionStatement: {
      fontSize: '18px',
      fontStyle: 'italic',
      color: '#2c3e50',
      lineHeight: '1.6',
      margin: '0'
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      marginTop: '30px'
    },
    featureCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '25px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    },
    featureIcon: {
      backgroundColor: '#e8f4fc',
      padding: '15px',
      borderRadius: '50%',
      marginBottom: '15px',
      color: '#3498db',
      fontSize: '32px'
    },
    featureTitle: {
      fontSize: '20px',
      marginBottom: '10px',
      fontWeight: 'bold',
      color: '#2c3e50'
    },
    featureDescription: {
      fontSize: '15px',
      lineHeight: '1.6',
      color: '#666'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    headerTitle: {
      fontSize: '42px',
      color: '#2c3e50',
      marginBottom: '10px'
    },
    headerSubtitle: {
      fontSize: '20px',
      color: '#666',
      marginBottom: '20px'
    }
  };

  return (
    <div style={styles.container}>
      <Header /><br /><br />
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Power Plate</h1>
        <p style={styles.headerSubtitle}>Personalized Nutrition for a Healthier You</p>
      </header>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Story</h2>
        <p style={styles.storyText}>
          Founded in 2025, Power Plate was born from a simple observation: generic diet plans don't work. Our founder, a nutritionist 
          with over 1 years of experience, saw firsthand how people struggled with one-size-fits-all approaches to nutrition and weight management.
        </p>
        <p style={styles.storyText}>
          We built Power Plate with the belief that everyone deserves a nutrition plan as unique as they are. By combining cutting-edge 
          nutritional science with innovative technology, we've created a platform that adapts to your specific needs, preferences, and goals.
        </p>
        <p style={styles.storyText}>
          Today, Power Plate serves thousands of users worldwide, helping them transform their relationship with food and achieve 
          sustainable health outcomes through personalized meal planning and nutritional guidance.
        </p>
      </section>

      <section style={styles.mission}>
        <h2 style={styles.sectionTitle}>Our Mission</h2>
        <p style={styles.missionStatement}>
          "To empower individuals with personalized nutrition solutions that make healthy eating simple, enjoyable, and sustainable—transforming 
          lives one meal at a time."
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>What Sets Us Apart</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              👤
            </div>
            <h3 style={styles.featureTitle}>Truly Personalized</h3>
            <p style={styles.featureDescription}>
              We consider your unique dietary needs, health goals, food preferences, allergies, and lifestyle to create a meal plan that's 
              perfect for you.
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              🥗
            </div>
            <h3 style={styles.featureTitle}>Science-Based Nutrition</h3>
            <p style={styles.featureDescription}>
              All our meal plans are designed by registered dietitians and nutritionists based on the latest nutritional research.
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              ✓
            </div>
            <h3 style={styles.featureTitle}>Easy to Follow</h3>
            <p style={styles.featureDescription}>
              Simple recipes, grocery lists, and meal prep guides make healthy eating effortless, no matter how busy your schedule.
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              ❤️
            </div>
            <h3 style={styles.featureTitle}>Focus on Wellbeing</h3>
            <p style={styles.featureDescription}>
              We promote overall health, not just weight loss, addressing nutritional balance for optimal energy and wellness.
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              ⚠️
            </div>
            <h3 style={styles.featureTitle}>Dietary Accommodation</h3>
            <p style={styles.featureDescription}>
              Whether you're vegan, keto, gluten-free, or have specific allergies, our system adapts to accommodate your needs.
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              ⏰
            </div>
            <h3 style={styles.featureTitle}>Adaptive Over Time</h3>
            <p style={styles.featureDescription}>
              Our platform evolves with you, adjusting meal plans based on your progress, feedback, and changing goals.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}