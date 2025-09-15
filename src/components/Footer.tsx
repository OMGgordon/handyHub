export function Footer() {
  return (
    <footer className="bg-[#faf0df] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Coming Soon & App Store */}
        <div className="lg:col-span-1 flex flex-row justify-between">
          <div className="flex  items-center mb-6">
            <img
              src="/images/logo.png"
              alt="HandyHive Logo"
              className="w-35 h-16"
            />
          </div>

          <div className="space-y-3 flex flex-col">
            <h3 className="text-[12px] font-bold text-[#282827] mb-4">
              Coming Soon
            </h3>
            <div className="flex flex-row">
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
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-300 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#282827]">
              <span>Terms of Use</span>
              <span>|</span>
              <span>Privacy Policy</span>
              {/* <span>|</span>
              <span>Sitemap</span>
              <span>|</span>
              <span>Accessibility Tools</span>
              <span>|</span>
              <span>Do Not Sell or Share My Personal Information</span> */}
            </div>

            <div className="flex items-center gap-4">
              <img
                src="/images/twitter.png"
                alt="Twitter"
                className="w-8 h-8"
              />
              {/* <img src="/images/facebook.png" alt="Facebook" className="w-8 h-8" /> */}
              {/* <img src="/images/pinterest.png" alt="Pinterest" className="w-8 h-8" /> */}
              <img
                src="/images/YouTube.png"
                alt="YouTube"
                className="w-8 h-8"
              />
              <img
                src="/images/instagram.png"
                alt="Instagram"
                className="w-8 h-8"
              />
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