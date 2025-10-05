import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  User,
  Settings,
  Bell,
  Shield,
  Trash2,
  Zap,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useUserProfile } from "../hooks/useUserProfile";

interface UserProfile {
  name: string;
  email: string;
  profession: string;
  customProfession: string;
  goals: string[];
  tone: string;
  contentPillars: string[];
  emailNotifications: {
    contentReady: boolean;
    weeklyDigest: boolean;
    productUpdates: boolean;
    tips: boolean;
  };
  password: string;
  confirmPassword: string;
}

const professions = [
  "Marketing Professional",
  "Sales Manager",
  "Business Coach",
  "Consultant",
  "Entrepreneur",
  "Real Estate Agent",
  "Financial Advisor",
  "Healthcare Professional",
  "Technology Professional",
  "Creative Professional",
  "Other (specify)",
];

const goals = [
  { id: "reach", label: "Increase Reach & Visibility" },
  { id: "authority", label: "Build Thought Leadership" },
  { id: "clients", label: "Generate Leads & Clients" },
  { id: "network", label: "Professional Networking" },
];

const tones = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Conversational" },
  { id: "storytelling", label: "Storytelling" },
  { id: "educational", label: "Educational" },
];

const contentPillars = [
  { id: "thought-leadership", label: "Thought Leadership" },
  { id: "tips-advice", label: "Tips & Advice" },
  { id: "personal-story", label: "Personal Stories" },
  { id: "business-growth", label: "Business Growth" },
  { id: "behind-scenes", label: "Behind the Scenes" },
  { id: "industry-insights", label: "Industry Insights" },
];

const ProfileSettingsPage = () => {
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL RETURNS
  const [activeTab, setActiveTab] = useState<
    "profile" | "preferences" | "account"
  >("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    email: "",
    profession: "",
    customProfession: "",
    goals: [],
    tone: "",
    contentPillars: [],
    emailNotifications: {
      contentReady: true,
      weeklyDigest: true,
      productUpdates: true,
      tips: true,
    },
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const {
    profile,
    preferences,
    loading: profileLoading,
    error,
    updateProfile,
    updatePreferences,
  } = useUserProfile();

  // Redirect to onboarding if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/onboarding");
    }
  }, [user, loading, navigate]);

  // Update form data when profile/preferences change
  useEffect(() => {
    if (user && (profile || preferences)) {
      setFormData({
        name: profile?.name || user?.user_metadata?.name || "",
        email: user?.email || "",
        profession: preferences?.profession || "",
        customProfession: preferences?.custom_profession || "",
        goals: preferences?.content_goals || [],
        tone: preferences?.preferred_tone || "",
        contentPillars: preferences?.content_pillars || [],
        emailNotifications: preferences?.email_notifications || {
          contentReady: true,
          weeklyDigest: true,
          productUpdates: true,
          tips: true,
        },
        password: "",
        confirmPassword: "",
      });
    }
  }, [profile, preferences, user]);

  // NOW IT'S SAFE TO DO CONDITIONAL RETURNS - ALL HOOKS HAVE BEEN CALLED

  // Show loading while checking authentication or loading profile
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if profile loading failed
  if (error) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-4">
            <h2 className="text-xl font-semibold text-red-400 mb-2">
              Profile Loading Error
            </h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-electric-blue text-white px-4 py-2 rounded-lg hover:bg-electric-blue/80 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const handleSave = async () => {
    // Validate form
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setSaveStatus("error");
      return;
    }

    setSaveStatus("saving");

    try {
      // Update profile
      await updateProfile({
        name: formData.name,
        industry:
          formData.profession !== "Other (specify)"
            ? formData.profession
            : formData.customProfession,
        target_audience: formData.goals.join(", "),
      });

      // Update preferences
      await updatePreferences({
        profession: formData.profession,
        custom_profession: formData.customProfession,
        content_goals: formData.goals,
        preferred_tone: formData.tone,
        content_pillars: formData.contentPillars,
        email_notifications: formData.emailNotifications,
      });

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleGoalToggle = (goalId: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter((g) => g !== goalId)
        : [...prev.goals, goalId],
    }));
  };

  const handlePillarToggle = (pillarId: string) => {
    setFormData((prev) => ({
      ...prev,
      contentPillars: prev.contentPillars.includes(pillarId)
        ? prev.contentPillars.filter((p) => p !== pillarId)
        : [...prev.contentPillars, pillarId],
    }));
  };

  const handleNotificationToggle = (
    key: keyof typeof formData.emailNotifications
  ) => {
    setFormData((prev) => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [key]: !prev.emailNotifications[key],
      },
    }));
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleBackToLanding = () => {
    navigate("/");
  };

  const tabs = [
    { id: "profile", label: "Profile Info", icon: User },
    { id: "preferences", label: "Content Preferences", icon: Settings },
    { id: "account", label: "Account Settings", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-charcoal text-white font-manrope">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-electric-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-magenta/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Header */}
        <header className="border-b border-medium-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-electric-blue to-magenta p-2 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bebas text-white">
                  ContentGen Pro
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToDashboard}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </button>
                <button
                  onClick={handleBackToLanding}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl font-bebas text-white mb-4">
              Profile & Settings
            </h1>
            <p className="text-xl text-gray-300">
              Manage your account and customize your content generation
              preferences
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-medium-gray rounded-2xl p-6 border border-gray-700 animate-fade-in-up">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                          activeTab === tab.id
                            ? "bg-gradient-to-r from-electric-blue to-magenta text-white"
                            : "text-gray-400 hover:text-white hover:bg-charcoal"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-medium-gray rounded-2xl p-8 border border-gray-700 animate-fade-in-up">
                {/* Profile Info Tab */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bebas text-white mb-6">
                      Profile Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className={`w-full px-4 py-3 bg-charcoal border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors ${
                            errors.name
                              ? "border-red-500"
                              : "border-gray-600 focus:border-electric-blue"
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && (
                          <p className="text-red-400 text-sm mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          className={`w-full px-4 py-3 bg-charcoal border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors ${
                            errors.email
                              ? "border-red-500"
                              : "border-gray-600 focus:border-electric-blue"
                          }`}
                          placeholder="Enter your email address"
                        />
                        {errors.email && (
                          <p className="text-red-400 text-sm mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Profession / Industry
                      </label>
                      <select
                        value={formData.profession}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            profession: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-charcoal border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-colors"
                      >
                        {professions.map((profession) => (
                          <option key={profession} value={profession}>
                            {profession}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formData.profession === "Other (specify)" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Specify Your Profession
                        </label>
                        <input
                          type="text"
                          value={formData.customProfession}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              customProfession: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 bg-charcoal border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-colors"
                          placeholder="Enter your profession"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Content Preferences Tab */}
                {activeTab === "preferences" && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bebas text-white mb-6">
                      Content Preferences
                    </h2>

                    {/* Content Goals */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">
                        Content Goals (Select all that apply)
                      </label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {goals.map((goal) => (
                          <button
                            key={goal.id}
                            onClick={() => handleGoalToggle(goal.id)}
                            className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                              formData.goals.includes(goal.id)
                                ? "border-electric-blue bg-electric-blue/10"
                                : "border-gray-600 bg-charcoal hover:border-gray-500"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  formData.goals.includes(goal.id)
                                    ? "border-electric-blue bg-electric-blue"
                                    : "border-gray-500"
                                }`}
                              >
                                {formData.goals.includes(goal.id) && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <span className="font-semibold text-white">
                                {goal.label}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Content Tone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">
                        Preferred Content Tone
                      </label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {tones.map((tone) => (
                          <button
                            key={tone.id}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                tone: tone.id,
                              }))
                            }
                            className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                              formData.tone === tone.id
                                ? "border-magenta bg-magenta/10"
                                : "border-gray-600 bg-charcoal hover:border-gray-500"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  formData.tone === tone.id
                                    ? "border-magenta bg-magenta"
                                    : "border-gray-500"
                                }`}
                              >
                                {formData.tone === tone.id && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <span className="font-semibold text-white">
                                {tone.label}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Content Pillars */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">
                        Preferred Content Pillars (Select your favorites)
                      </label>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {contentPillars.map((pillar) => (
                          <button
                            key={pillar.id}
                            onClick={() => handlePillarToggle(pillar.id)}
                            className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                              formData.contentPillars.includes(pillar.id)
                                ? "border-electric-blue bg-electric-blue/10"
                                : "border-gray-600 bg-charcoal hover:border-gray-500"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  formData.contentPillars.includes(pillar.id)
                                    ? "border-electric-blue bg-electric-blue"
                                    : "border-gray-500"
                                }`}
                              >
                                {formData.contentPillars.includes(
                                  pillar.id
                                ) && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className="font-medium text-white text-sm">
                                {pillar.label}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Settings Tab */}
                {activeTab === "account" && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bebas text-white mb-6">
                      Account Settings
                    </h2>

                    {/* Change Password */}
                    <div className="bg-charcoal rounded-lg p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Change Password
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                              className={`w-full px-4 py-3 bg-medium-gray border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors pr-12 ${
                                errors.password
                                  ? "border-red-500"
                                  : "border-gray-600 focus:border-electric-blue"
                              }`}
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <p className="text-red-400 text-sm mt-1">
                              {errors.password}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={formData.confirmPassword}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  confirmPassword: e.target.value,
                                }))
                              }
                              className={`w-full px-4 py-3 bg-medium-gray border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors pr-12 ${
                                errors.confirmPassword
                                  ? "border-red-500"
                                  : "border-gray-600 focus:border-electric-blue"
                              }`}
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="text-red-400 text-sm mt-1">
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Email Notifications */}
                    <div className="bg-charcoal rounded-lg p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <Bell className="w-5 h-5" />
                        <span>Email Notifications</span>
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            key: "contentReady",
                            label: "Content Ready Notifications",
                            description:
                              "Get notified when new content is generated",
                          },
                          {
                            key: "weeklyDigest",
                            label: "Weekly Content Digest",
                            description:
                              "Weekly summary of your content performance",
                          },
                          {
                            key: "productUpdates",
                            label: "Product Updates",
                            description:
                              "New features and platform improvements",
                          },
                          {
                            key: "tips",
                            label: "Content Tips & Best Practices",
                            description:
                              "Expert advice to improve your content strategy",
                          },
                        ].map((notification) => (
                          <div
                            key={notification.key}
                            className="flex items-center justify-between p-4 bg-medium-gray rounded-lg"
                          >
                            <div>
                              <div className="text-white font-medium">
                                {notification.label}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {notification.description}
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleNotificationToggle(
                                  notification.key as keyof typeof formData.emailNotifications
                                )
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                formData.emailNotifications[
                                  notification.key as keyof typeof formData.emailNotifications
                                ]
                                  ? "bg-electric-blue"
                                  : "bg-gray-600"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  formData.emailNotifications[
                                    notification.key as keyof typeof formData.emailNotifications
                                  ]
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center space-x-2">
                        <Trash2 className="w-5 h-5" />
                        <span>Danger Zone</span>
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-8 border-t border-gray-700 mt-8">
                  <button
                    onClick={handleSave}
                    disabled={saveStatus === "saving"}
                    className={`flex items-center space-x-2 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                      saveStatus === "saved"
                        ? "bg-green-600 text-white"
                        : saveStatus === "error"
                        ? "bg-red-600 text-white"
                        : "bg-gradient-to-r from-electric-blue to-magenta text-white hover:shadow-lg hover:shadow-electric-blue/25"
                    }`}
                  >
                    {saveStatus === "saving" ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : saveStatus === "saved" ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
