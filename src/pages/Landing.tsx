import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Layers, MousePointer2, Zap, Save } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-purple-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-sm font-medium text-purple-200">
                New: 3D Furniture Library
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Design your dream <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-[length:200%_auto] animate-gradient">
                room in minutes.
              </span>
            </h1>

            <p className="max-w-2xl text-xl text-white/50 mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              The professional 3D interior design tool that works right in your
              browser. Easy to use, powerful features, and stunning results.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-white/90 rounded-full px-12 h-16 text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
              >
                <Link to="/register" className="flex items-center gap-2">
                  Get Started for Free <ChevronRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-12 h-16 text-lg text-black font-bold border-white/10 hover:bg-white/5 backdrop-blur-md transition-all"
              >
                View Demo
              </Button>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40">
            {[
              {
                icon: MousePointer2,
                title: "Intuitive Controls",
                desc: "Drag and drop interface that feels natural and smooth.",
              },
              {
                icon: Layers,
                title: "Multi-layer Design",
                desc: "Separate walls, furniture, and lighting for ultimate control.",
              },
              {
                icon: Zap,
                title: "Real-time Rendering",
                desc: "See your changes instantly with our high-performance engine.",
              },
              {
                icon: Save,
                title: "Cloud Sync",
                desc: "Your projects are automatically saved and synced to the cloud.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 border-y border-white/5 bg-[#0D0D0F]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Users", value: "50k+" },
              { label: "Projects Created", value: "1.2M+" },
              { label: "3D Models", value: "1000+" },
              { label: "Monthly Visitors", value: "250k" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-black mb-2 text-white">
                  {stat.value}
                </div>
                <div className="text-white/30 font-medium tracking-wider uppercase text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-t from-purple-500/10 to-transparent" />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            Ready to start designing?
          </h2>
          <p className="text-xl text-white/50 mb-12">
            Join thousands of people creating beautiful spaces every day.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-white/90 rounded-full px-12 h-16 text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
          >
            <Link to="/register">Create Your Account</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
