import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle, 
  Phone, 
  BarChart3, 
  Users, 
  Shield, 
  Zap, 
  Globe,
  Star,
  PlayCircle,
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  Sparkles,
  Award,
  TrendingUp
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center cursor-pointer group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">VoiceAI</span>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                <a 
                  href="#features" 
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50"
                >
                  Features
                </a>
                <a 
                  href="#pricing" 
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50"
                >
                  Pricing
                </a>
                <a 
                  href="#testimonials" 
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50"
                >
                  Testimonials
                </a>
                <Link 
                  href="/dashboard" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium cursor-pointer hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ml-4"
                >
                  Dashboard
                  <ArrowUpRight className="w-4 h-4 inline ml-1" />
                </Link>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900 p-2 rounded-lg cursor-pointer transition-colors duration-200">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-8 animate-fadeIn">
              <Sparkles className="w-4 h-4 mr-2" />
              Trusted by 1000+ Healthcare Providers
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x"> 
                Healthcare
              </span>
              <br />Communication
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Automate patient calls, collect demographics, and streamline healthcare operations with our 
              <span className="font-semibold text-gray-900"> AI-powered voice assistant platform.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a 
                href="#pricing"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-medium rounded-xl cursor-pointer hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
              <button className="inline-flex items-center px-8 py-4 border-2 border-gray-200 text-lg font-medium rounded-xl text-gray-700 bg-white/80 backdrop-blur-sm cursor-pointer hover:bg-white hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group">
                <PlayCircle className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                Watch Demo
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
                <div className="text-gray-600">Uptime Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">50M+</div>
                <div className="text-gray-600">Calls Processed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
                <div className="text-gray-600">AI Support</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-30 animate-float-delay"></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-gradient-to-r from-green-200 to-blue-200 rounded-full opacity-20 animate-float-slow"></div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-6">
              <Award className="w-4 h-4 mr-2" />
              Industry Leading Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Modern Healthcare</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to automate and optimize your patient communication workflow with cutting-edge AI technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Enhanced Feature Cards */}
            {[
              {
                icon: Phone,
                title: "Automated Voice Calls",
                description: "Intelligent AI assistants that can make and receive calls, collect patient information, and handle routine inquiries 24/7.",
                color: "blue",
                gradient: "from-blue-100 to-blue-200"
              },
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description: "Comprehensive dashboard with call analytics, success rates, cost tracking, and detailed performance metrics.",
                color: "green",
                gradient: "from-green-100 to-green-200"
              },
              {
                icon: Users,
                title: "Patient Management",
                description: "Seamlessly integrate with your existing systems and automatically update patient records with collected data.",
                color: "purple",
                gradient: "from-purple-100 to-purple-200"
              },
              {
                icon: Shield,
                title: "HIPAA Compliant",
                description: "Enterprise-grade security with full HIPAA compliance, encrypted communications, and secure data storage.",
                color: "red",
                gradient: "from-red-100 to-red-200"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Sub-second response times with advanced AI models that understand context and provide natural conversations.",
                color: "yellow",
                gradient: "from-yellow-100 to-yellow-200"
              },
              {
                icon: Globe,
                title: "Multi-language Support",
                description: "Support for 40+ languages with natural accent recognition and culturally appropriate communication styles.",
                color: "indigo",
                gradient: "from-indigo-100 to-indigo-200"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer group hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Transparent Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your healthcare organization. Start free, scale as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Enhanced Pricing Cards */}
            {[
              {
                name: "Starter",
                description: "Perfect for small practices",
                price: "$99",
                period: "/month",
                features: [
                  "Up to 500 calls/month",
                  "Basic analytics",
                  "Email support",
                  "Standard AI assistant"
                ],
                buttonText: "Start Free Trial",
                buttonStyle: "border border-blue-600 text-blue-600 hover:bg-blue-50",
                popular: false
              },
              {
                name: "Professional",
                description: "For growing healthcare practices",
                price: "$299",
                period: "/month",
                features: [
                  "Up to 2,000 calls/month",
                  "Advanced analytics & reporting",
                  "Priority support",
                  "Custom AI training",
                  "API access"
                ],
                buttonText: "Start Free Trial",
                buttonStyle: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg",
                popular: true
              },
              {
                name: "Enterprise",
                description: "For large healthcare systems",
                price: "Custom",
                period: "",
                features: [
                  "Unlimited calls",
                  "Custom integrations",
                  "Dedicated support team",
                  "On-premise deployment",
                  "SLA guarantee"
                ],
                buttonText: "Contact Sales",
                buttonStyle: "border border-gray-600 text-gray-600 hover:bg-gray-50",
                popular: false
              }
            ].map((plan, index) => (
              <div 
                key={index}
                className={`bg-white rounded-3xl shadow-lg border transition-all duration-300 cursor-pointer hover:shadow-2xl hover:-translate-y-2 ${
                  plan.popular 
                    ? 'border-blue-500 relative transform scale-105' 
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <div className="mb-8">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                    
                    <ul className="space-y-4 mb-8 text-left">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer ${plan.buttonStyle}`}>
                      {plan.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-800 text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Customer Success Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Healthcare Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers are saying about VoiceAI and how it&apos;s transforming their operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "VoiceAI transformed our patient intake process. We've reduced manual work by 80% and improved patient satisfaction significantly.",
                author: "Dr. Sarah Johnson",
                role: "Chief Medical Officer, HealthCare Plus",
                avatar: "SJ"
              },
              {
                quote: "The AI is incredibly natural and patients love how easy it is to provide their information. Setup was seamless.",
                author: "Michael Chen",
                role: "IT Director, Regional Medical Center",
                avatar: "MC"
              },
              {
                quote: "ROI was immediate. We're processing 3x more patient calls with the same staff and better accuracy.",
                author: "Lisa Rodriguez",
                role: "Operations Manager, City Clinic",
                avatar: "LR"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer hover:-translate-y-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='m0 40l40-40h-40v40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Healthcare Communication?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of healthcare providers who trust VoiceAI to streamline their operations and improve patient satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-medium rounded-xl cursor-pointer hover:bg-gray-100 transition-all duration-300 shadow-2xl transform hover:-translate-y-1 group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <button className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-medium rounded-xl cursor-pointer hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1">
              Schedule Demo
            </button>
          </div>
          
          {/* Trust badges */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-blue-100 text-sm mb-4">Trusted by industry leaders</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-white font-bold text-lg">HealthCare+</div>
              <div className="text-white font-bold text-lg">MedCenter</div>
              <div className="text-white font-bold text-lg">CityClinic</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">VoiceAI</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Transforming healthcare communication with intelligent AI voice assistants that improve efficiency and patient satisfaction.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Product</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200">Status</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 VoiceAI. All rights reserved. Made with ❤️ for healthcare.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}