import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Eye, Globe, Shield, Zap, Users, CheckCircle, Linkedin, Mail } from 'lucide-react';
import AnimatedCursor from '../components/AnimatedCursor';

const AboutUs: React.FC = () => {
  const services = [
    {
      icon: Bot,
      title: 'AI Document Analysis',
      description: 'Advanced AI powered by Google Gemini analyzes your documents and provides detailed explanations in simple language.',
      features: [
        'Clause-wise breakdown of legal documents',
        'Detection of hidden charges and risks',
        'Plain language summaries',
        'Context-aware explanations'
      ],
      technology: 'Google AI Studio (Gemini)',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Eye,
      title: 'OCR Text Extraction',
      description: 'Extract text from scanned documents, images, and PDFs with high accuracy using Google Cloud Vision API.',
      features: [
        'Multi-language text recognition',
        'Handwritten text extraction',
        'Table and form recognition',
        'Image enhancement and preprocessing'
      ],
      technology: 'Google Cloud Vision API',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Seamlessly work with documents in multiple Indian languages with real-time translation and explanation.',
      features: [
        'Support for 10+ Indian languages',
        'Real-time translation',
        'Context-aware language processing',
        'Regional document format recognition'
      ],
      technology: 'Google AI Studio + Translation API',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Shield,
      title: 'Secure Data Processing',
      description: 'Your documents are processed securely with enterprise-grade privacy protection and data encryption.',
      features: [
        'End-to-end encryption',
        'Secure cloud storage',
        'Privacy-first processing',
        'Compliance with data protection laws'
      ],
      technology: 'Firebase Security + Encryption',
      color: 'from-red-500 to-red-600'
    }
  ];

  const additionalServices = [
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Get instant results with our optimized AI pipeline for fast document analysis.'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Access to document experts and legal professionals for complex queries.'
    }
  ];

  const teamMembers = [
    {
      name: 'Puneet',
      role: 'Project Leader & Backend Developer',
      bio: 'Leading the project with 8+ years of experience in backend architecture and AI systems. Expert in Node.js, Python, and cloud infrastructure. Previously worked at major fintech companies building scalable document processing systems.',
      linkedin: 'https://linkedin.com/in/puneet',
      email: 'puneet@docassist.ai',
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300',
      imagePosition: 'left'
    },
    {
      name: 'Krishal',
      role: 'Frontend Developer',
      bio: 'Specializes in React, TypeScript, and modern web technologies. 5+ years of experience creating intuitive user interfaces. Expert in responsive design and accessibility standards for government applications.',
      linkedin: 'https://linkedin.com/in/krishal',
      email: 'krishal@docassist.ai',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
      imagePosition: 'right'
    },
    {
      name: 'Sneha',
      role: 'Frontend Developer',
      bio: 'Frontend specialist with expertise in Vue.js, Angular, and React. 4+ years of experience in building complex web applications. Focuses on performance optimization and user experience design.',
      linkedin: 'https://linkedin.com/in/sneha',
      email: 'sneha@docassist.ai',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
      imagePosition: 'left'
    },
    {
      name: 'Vishruti',
      role: 'Backend Developer',
      bio: 'Backend engineer with deep expertise in database design, API development, and microservices architecture. 6+ years of experience with Java, Spring Boot, and cloud platforms.',
      linkedin: 'https://linkedin.com/in/vishruti',
      email: 'vishruti@docassist.ai',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
      imagePosition: 'right'
    },
    {
      name: 'Kriti',
      role: 'Backend Developer & DevOps',
      bio: 'Backend developer and DevOps specialist with expertise in containerization, CI/CD pipelines, and cloud infrastructure. Former government official with deep understanding of Indian documentation processes.',
      linkedin: 'https://linkedin.com/in/kriti',
      email: 'kriti@docassist.ai',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300',
      imagePosition: 'left'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AnimatedCursor />
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">About Docqulio</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          We're a team of passionate technologists and policy experts dedicated to simplifying document processes for Indian citizens
        </p>
      </div>

      {/* Services Section */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Services</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Comprehensive AI-powered solutions for all your document processing needs
          </p>
          <div className="mt-6">
            <Link
              to="/ai-chat"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              Try Our Services
              <Bot className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Main Services */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => (
            <div key={index} className="bg-white/95 dark:bg-slate-800 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-start space-x-4 mb-6">
                <div className={`w-14 h-14 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    {service.description}
                  </p>
                  <div className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300">
                    <Zap className="w-3 h-3 mr-1" />
                    {service.technology}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900 dark:text-white">Key Features:</h4>
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {additionalServices.map((service, index) => (
            <div key={index} className="bg-gradient-to-r from-slate-50/90 to-slate-100/90 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-xl flex items-center justify-center">
                  <service.icon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="bg-gradient-to-r from-blue-50/90 to-purple-50/90 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 mb-16 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Powered by Industry-Leading Technology
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              We use the most advanced AI and cloud technologies to ensure reliable, accurate results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-white/95 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md backdrop-blur-sm">
                <Bot className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Google AI Studio</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Advanced language processing</p>
            </div>

            <div className="text-center p-4">
              <div className="w-16 h-16 bg-white/95 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md backdrop-blur-sm">
                <Eye className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Vision API</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Optical character recognition</p>
            </div>

            <div className="text-center p-4">
              <div className="w-16 h-16 bg-white/95 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md backdrop-blur-sm">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Firebase</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Secure hosting & authentication</p>
            </div>

            <div className="text-center p-4">
              <div className="w-16 h-16 bg-white/95 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md backdrop-blur-sm">
                <Globe className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Translation API</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Multi-language support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Summary */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Meet Our Team</h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Our diverse team combines deep technical expertise with real-world understanding of Indian government processes. 
            We're united by a shared mission to make document processing accessible, transparent, and efficient for every citizen.
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            With backgrounds spanning AI research, government service, and user experience design, we bring both innovation and practical knowledge to solve complex bureaucratic challenges.
          </p>
        </div>
      </div>

      {/* Team Members */}
      <div className="space-y-12 mb-16">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-white/95 dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
            <div className={`flex flex-col ${member.imagePosition === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center`}>
              {/* Image */}
              <div className="w-full lg:w-1/3 h-64 lg:h-80">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="w-full lg:w-2/3 p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-4">
                      {member.role}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-blue-600" />
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <Mail className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </a>
                  </div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                  {member.bio}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Company Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Making a Difference</h2>
          <p className="text-blue-100">Our impact in numbers</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">50K+</div>
            <div className="text-blue-100 text-sm">Documents Processed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">98%</div>
            <div className="text-blue-100 text-sm">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">15+</div>
            <div className="text-blue-100 text-sm">Indian Languages</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">24/7</div>
            <div className="text-blue-100 text-sm">AI Availability</div>
          </div>
        </div>
      </div>

      {/* Contact & Technology */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white/95 dark:bg-slate-800 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Get in Touch</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <span className="text-slate-700 dark:text-slate-300">contact@docassist.ai</span>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-slate-700 dark:text-slate-300">Support available in multiple languages</span>
            </div>
          </div>
        </div>

        <div className="bg-white/95 dark:bg-slate-800 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Deployment & Hosting</h3>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-slate-700 dark:text-slate-300">Hosted on Firebase</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Deployed on Google Firebase for maximum reliability, security, and global accessibility.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;