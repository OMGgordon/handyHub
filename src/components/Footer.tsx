export function Footer() {
  return (
    <footer className="bg-[#faf0df] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Coming Soon & App Store */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <img 
                src="/images/logo.png"
                alt="HandyHive Logo"
                className="w-30 h-16"
              />
            </div>
            <h3 className="text-[12px] font-bold text-[#282827] mb-4">Coming Soon</h3>
            <div className="space-y-3">
              <img 
                src="/images/appstore.png" 
                alt="Download on App Store"
                className="h-12 w-auto"
              />
              <img 
                src="/images/googleplay.png"
                alt="Get it on Google Play" 
                className="h-12 w-auto"
              />
            </div>
          </div>

          {/* Homeowner services */}
          <div>
            <h3 className="text-[12px] font-bold text-[#282827] mb-4">Homeowner services</h3>
            <ul className="space-y-3 text-[13px] text-[#282827]">
              <li>Find local businesses</li>
              <li>Services near me</li>
            </ul>
          </div>

          {/* For service pros */}
          <div>
            <h3 className="text-[12px] font-bold text-[#282827] mb-4">For service pros</h3>
            <ul className="space-y-3 text-[13px] text-[#282827]">
              <li>Register your business</li>
              <li>Business center</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-[12px] font-bold text-[#282827] mb-4">Resources</h3>
            <ul className="space-y-3 text-[13px] text-[#282827]">
              <li>Solution center</li>
              <li>Project cost center</li>
              <li>FAQs</li>
              <li>Financing</li>
            </ul>
          </div>

          {/* About us */}
          <div>
            <h3 className="text-[12px] font-bold text-[#282827] mb-4">About us</h3>
            <ul className="space-y-3 text-[13px] text-[#282827]">
              <li>How it works</li>
              <li>Who we are</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Investor relations</li>
              <li>Contact us</li>
              <li>Happiness guarantee</li>
              <li>Affiliate partners</li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-300 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#282827]">
              <span>Terms of Use</span>
              <span>|</span>
              <span>Privacy Policy</span>
              <span>|</span>
              <span>Sitemap</span>
              <span>|</span>
              <span>Accessibility Tools</span>
              <span>|</span>
              <span>Do Not Sell or Share My Personal Information</span>
            </div>
            
            <div className="flex items-center gap-4">
              <img src="/images/twitter.png" alt="Twitter" className="w-8 h-8" />
              <img src="/images/facebook.png" alt="Facebook" className="w-8 h-8" />
              <img src="/images/pinterest.png" alt="Pinterest" className="w-8 h-8" />
              <img src="/images/YouTube.png" alt="YouTube" className="w-8 h-8" />
              <img src="/images/instagram.png" alt="Instagram" className="w-8 h-8" />
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-[10px] text-[#282827]">
              © Copyright 2025, HandyHive. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}