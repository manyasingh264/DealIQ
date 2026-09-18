import React, { useState } from "react";
import { useAuth } from "../context/auth";
import { Loader2, AlertCircle, CheckCircle2, Lock, Mail, Building, User, Sparkles } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Auth() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("signin"); // "signin" | "signup"

  // Sign In Form State - Defaulted to Demo Admin
  const [signInEmail, setSignInEmail] = useState("admin@dealiq.com");
  const [signInPassword, setSignInPassword] = useState("admin123");

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState("");
  const [signUpCompany, setSignUpCompany] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    if (!signInEmail || !signInPassword) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      await login(signInEmail.trim(), signInPassword);
    } catch (err) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    if (!signUpName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!signUpCompany.trim()) {
      setError("Company / Organization name is required.");
      return;
    }
    if (!signUpEmail.trim()) {
      setError("Email address is required.");
      return;
    }
    if (signUpPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);
      await signup({
        name: signUpName.trim(),
        companyName: signUpCompany.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
      });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setSignInEmail("admin@dealiq.com");
    setSignInPassword("admin123");
    setError(null);
  };

  const fillDemoAE = () => {
    setSignInEmail("ae@dealiq.com");
    setSignInPassword("ae123456");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl shadow-md flex items-center justify-center shadow-indigo-200">
            <span className="text-white font-black text-base tracking-tight">DQ</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">DealIQ</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Sales Intelligence & Deal Diagnostics
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {mode === "signin"
            ? "Sign in to access your sales deals and AI insights"
            : "Create an organization account for your sales team"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-200/80 rounded-2xl sm:px-10">
          {/* Mode Switcher Tabs */}
          <div className="flex bg-gray-100/80 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError(null);
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                mode === "signin"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                mode === "signup"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200/80 rounded-xl flex items-start gap-2.5 text-sm text-red-700 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Sign In Form */}
          {mode === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="admin@dealiq.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    autoComplete="off"
                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    placeholder="admin123"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    autoComplete="off"
                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full justify-center py-2.5 font-medium shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In to DealIQ"
                  )}
                </Button>
              </div>

              {/* Demo Credentials Quick-Fill */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2 font-medium">Quick Demo Accounts:</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={fillDemoAdmin}
                    className="flex-1 text-xs bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-gray-700 border border-gray-200/80 rounded-lg py-1.5 px-2.5 font-medium transition-colors text-center"
                  >
                    Demo Admin
                  </button>
                  <button
                    type="button"
                    onClick={fillDemoAE}
                    className="flex-1 text-xs bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-gray-700 border border-gray-200/80 rounded-lg py-1.5 px-2.5 font-medium transition-colors text-center"
                  >
                    Demo AE
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Sign Up Form */}
          {mode === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Sarah Connor"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Organization / Company
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Apex Global Sales"
                    value={signUpCompany}
                    onChange={(e) => setSignUpCompany(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="sarah@apex.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Password (min. 8 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="••••••••"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full justify-center py-2.5 font-medium shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Organization Account...
                    </>
                  ) : (
                    "Create Account & Get Started"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
