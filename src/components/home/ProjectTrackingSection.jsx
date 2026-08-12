import React from 'react';

const ProjectTrackingSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Track Your Project Progress in Real-Time
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Stay in the loop with our interactive client dashboard. Monitor daily updates, 
              track milestones, and communicate directly with our team so you always 
              know exactly where your project stands.
            </p>
            
            <ul className="space-y-8">
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h4 className="ml-3 text-lg font-bold text-gray-900">Live Status Updates</h4>
                </div>
                <p className="mt-2 ml-9 text-gray-600">
                  Check the exact phase of your development journey anytime.
                </p>
              </li>
              
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h4 className="ml-3 text-lg font-bold text-gray-900">Milestone Tracking</h4>
                </div>
                <p className="mt-2 ml-9 text-gray-600">
                  Review and approve completed milestones instantly.
                </p>
              </li>
              
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h4 className="ml-3 text-lg font-bold text-gray-900">Transparent Communication</h4>
                </div>
                <p className="mt-2 ml-9 text-gray-600">
                  Leave feedback directly on the dashboard.
                </p>
              </li>
            </ul>
          </div>

          <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
            <div className="bg-white p-3 rounded-3xl border border-gray-300 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Project Tracking Dashboard" 
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProjectTrackingSection;