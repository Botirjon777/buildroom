import { Layout } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/5 bg-[#0A0A0B]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-purple-400" />
          <span className="text-lg font-bold text-white">DreamDesign</span>
        </div>
        <div className="text-white/30 text-sm">
          © 2026 DreamDesign. All rights reserved.
        </div>
        <div className="flex gap-8 text-sm font-medium text-white/40">
          <a href="#" className="hover:text-white transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
