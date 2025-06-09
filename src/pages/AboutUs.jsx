import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Back button with margin-top and margin-bottom */}
      <div className="mb-3 mt-3" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline-secondary btn-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
          Back
        </button>
      </div>
      <div className="about-us-container">
        <div className="about-us-header">
          <h2>About PM-POSHAN Scheme</h2>
          <div className="divider"></div>
        </div>

        <div className="about-us-intro">
          <h3>Mid Day Meal Scheme (PM-POSHAN)</h3>
          <p>
            The Mid Day Meal Scheme is a school meal programme in India designed to 
            better the nutritional status of school-age children nationwide. The scheme 
            has been renamed as <strong>PM-POSHAN Scheme</strong>.
          </p>
          <p>
            The programme supplies free lunches on working days for children in government 
            primary and upper primary schools, government-aided Anganwadis, Madarsa, and Maqtabs. 
            Serving <strong>120 million children</strong> in over <strong>1.27 million schools</strong>, 
            it is the largest of its kind in the world.
          </p>
        </div>

        <div className="about-us-features">
          <div className="feature-card">
            <div className="feature-icon">📌</div>
            <div className="feature-content">
              <h4>History</h4>
              <p>
                Implemented in Puducherry since <strong>1930</strong> under French administration. 
                Tamil Nadu pioneered it in the 1960s under <strong>K. Kamaraj</strong>. Nationwide 
                implementation ordered by Supreme Court in 2002.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📌</div>
            <div className="feature-content">
              <h4>Recent Updates</h4>
              <p>
                Renamed to <strong>PM-POSHAN</strong> in <strong>September 2021</strong>. 
                Expanded to include <strong>24 lakh pre-primary students</strong> in 2022.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📌</div>
            <div className="feature-content">
              <h4>Legal Backing</h4>
              <p>
                Under <strong>Article 24 of Convention on Rights of the Child</strong> and 
                <strong>National Food Security Act, 2013</strong>, ensuring children's 
                right to nutritious food.
              </p>
            </div>
          </div>
        </div>

        <div className="about-us-footer">
          <p>Source: Government Reports & Supreme Court Orders</p>
        </div>

        <style jsx>{`
          .about-us-container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
          }
          
          .about-us-header {
            text-align: center;
            margin-bottom: 2rem;
          }
          
          .about-us-header h2 {
            font-size: 2rem;
            color: #2c3e50;
            margin-bottom: 0.5rem;
          }
          
          .divider {
            width: 80px;
            height: 4px;
            background: #3498db;
            margin: 0 auto;
            border-radius: 2px;
          }
          
          .about-us-intro {
            background: #f8f9fa;
            padding: 2rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
          
          .about-us-intro h3 {
            color: #2c3e50;
            margin-bottom: 1rem;
            text-align: center;
          }
          
          .about-us-intro p {
            color: #495057;
            line-height: 1.6;
            margin-bottom: 1rem;
          }
          
          .about-us-features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }
          
          .feature-card {
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            box-shadow: 0 2px 15px rgba(0,0,0,0.1);
            display: flex;
            transition: transform 0.3s ease;
          }
          
          .feature-card:hover {
            transform: translateY(-5px);
          }
          
          .feature-icon {
            font-size: 1.5rem;
            margin-right: 1rem;
            color: #3498db;
          }
          
          .feature-content h4 {
            color: #2c3e50;
            margin-bottom: 0.5rem;
          }
          
          .feature-content p {
            color: #495057;
            line-height: 1.5;
          }
          
          .about-us-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
          }
          
          .stat-item {
            background: #3498db;
            color: white;
            padding: 1.5rem;
            border-radius: 8px;
            text-align: center;
          }
          
          .stat-item h3 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
          }
          
          .stat-item p {
            opacity: 0.9;
            margin-bottom: 0;
          }
          
          .about-us-footer {
            text-align: right;
            color: #6c757d;
            font-size: 0.9rem;
          }
          
          @media (max-width: 768px) {
            .about-us-features {
              grid-template-columns: 1fr;
            }
            
            .about-us-intro {
              padding: 1.5rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AboutUs;