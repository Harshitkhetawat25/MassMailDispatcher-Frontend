import React, { useState } from "react";

import {
  Mail,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  Menu,
  X,
  ArrowRight,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeaderHomePage from "../components/HeaderHomePage";
import FooterHomePage from "../components/FooterHomePage";
import useGetCurrentUser from "../hooks/useGetCurrentUser";

const MassMailDispatcher = () => {
  const { user, loading } = useGetCurrentUser();
  console.log(user);

  const benefits = [
    {
      icon: Zap,
      title: "10x Faster",
      description: "Send 1000+ emails in minutes",
    },
    {
      icon: Shield,
      title: "Higher Deliverability",
      description: "Use your trusted Gmail reputation",
    },
    {
      icon: Clock,
      title: "Save Hours Daily",
      description: "Automate your outreach process",
    },
    {
      icon: TrendingUp,
      title: "Better Results",
      description: "Track performance in real-time",
    },
  ];

  const stats = [
    { number: "500K+", label: "Emails Sent" },
    { number: "2,500+", label: "Active Users" },
    { number: "85%", label: "Open Rate" },
    { number: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <HeaderHomePage />

      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-br from-blue-50 to-indigo-100"
        id="hero"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/80 shadow rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Gmail Integration Ready
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Scale Your{" "}
              <span className="text-blue-600 block">Email Outreach</span>
            </h1>
            <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
              Transform your Gmail into a powerful marketing machine. Send
              personalized campaigns that actually get opened and drive results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg group font-semibold"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-blue-700">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Mass Mail Dispatcher?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just send emails. Build relationships, drive revenue, and
              grow your business.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="border shadow-sm hover:shadow-md transition-all duration-300 pt-7 group bg-white"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-8 h-8 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100"
        id="about"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-xl text-gray-600">
              From setup to sending in under 5 minutes
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Connect Gmail
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Secure OAuth integration with your Gmail account. No passwords
                stored, complete data privacy.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Import & Personalize
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Upload contacts and create dynamic templates with merge fields
                for maximum personalization.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Send & Track
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Launch campaigns and monitor opens, clicks, and responses with
                detailed analytics dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-" id="pricing">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
            Trusted by Growth-Focused Teams
          </h2>
          <p className="text-black text-lg mb-12">
            Join thousands of professionals who've scaled their outreach with
            Gmail
          </p>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 mb-8">
            <blockquote className="text-xl  italic mb-6">
              "Increased our response rate by 300% and saved 15 hours per week
              on email outreach. Game-changer for our sales team."
            </blockquote>
            <div>
              <div className="font-semibold ">Aman Godara</div>
              <div className="text-sm">Growth Lead, TechStartup Inc.</div>
            </div>
          </div>
          <Button
            size="lg"
            variant="outline"
            className="bg-white text-blue-700 hover:bg-blue-100 px-8 py-4 text-lg font-semibold"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Mass Mail Dispatcher</span>
              </div>
              <p className="text-gray-400 max-w-md mb-6">
                Transform your Gmail into a powerful marketing machine with
                personalized bulk email campaigns.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2025 Mass Mail Dispatcher. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer> */}
      <FooterHomePage />
    </div>
  );
};

export default MassMailDispatcher;
