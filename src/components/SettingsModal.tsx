import React, { useState, useCallback, useEffect, useRef } from "react";
import { PersistenceService } from "../services/persistenceService";

interface SettingsModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, isOpen }) => {
  // Use refs to avoid re-renders on every keystroke
  const githubApiKeyRef = useRef(PersistenceService.getGithubApiKey() || "");
  const jiraApiKeyRef = useRef(PersistenceService.getJiraApiKey() || "");
  const githubOwnerRef = useRef(PersistenceService.getGithubOwner() || "");
  const githubRepoRef = useRef(PersistenceService.getGithubRepo() || "");
  const jiraDomainRef = useRef(PersistenceService.getJiraDomain() || "");
  const jiraProjectKeyRef = useRef(PersistenceService.getJiraProjectKey() || "");
  const jiraEmailRef = useRef(PersistenceService.getJiraEmail() || "");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);

  // Trap focus within modal for accessibility
  useEffect(() => {
    if (!isOpen) return;

    const modalEl = modalRef.current;
    if (!modalEl) return;

    const focusableElements = modalEl.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    firstElement?.focus();
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!githubOwnerRef.current.trim()) newErrors.githubOwner = "Required";
    if (!githubRepoRef.current.trim()) newErrors.githubRepo = "Required";
    if (!jiraDomainRef.current.trim()) newErrors.jiraDomain = "Required";
    if (!jiraProjectKeyRef.current.trim()) newErrors.jiraProjectKey = "Required";
    if (!jiraEmailRef.current.trim()) newErrors.jiraEmail = "Valid email required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const handleSave = useCallback(() => {
    if (!validateForm()) return;

    PersistenceService.saveGithubApiKey(githubApiKeyRef.current);
    PersistenceService.saveJiraApiKey(jiraApiKeyRef.current);
    PersistenceService.saveGithubOwner(githubOwnerRef.current);
    PersistenceService.saveGithubRepo(githubRepoRef.current);
    PersistenceService.saveJiraDomain(jiraDomainRef.current);
    PersistenceService.saveJiraProjectKey(jiraProjectKeyRef.current);
    PersistenceService.saveJiraEmail(jiraEmailRef.current);
    
    onClose();
  }, [validateForm, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-slate-800/95 border border-slate-700 p-8 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 
            id="settings-modal-title"
            className="text-2xl font-bold text-slate-100"
          >
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-xl transition-colors"
            aria-label="Close settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-yellow-900/90 border border-yellow-700/50 text-yellow-100 px-4 py-3 rounded-xl backdrop-blur-sm">
            <h3 className="font-bold text-sm mb-1">⚠️ Security Warning</h3>
            <p className="text-xs leading-relaxed">
              API keys stored in localStorage are insecure. Consider using a backend proxy or environment variables for production.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                GitHub Owner <span className="text-red-400">*</span>
              </label>
              <input
                ref={(el) => el?.focus()}
                type="text"
                value={githubOwnerRef.current}
                onChange={(e) => (githubOwnerRef.current = e.target.value)}
                className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-sm text-slate-200 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.githubOwner 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-slate-700 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.githubOwner && (
                <p className="mt-1 text-xs text-red-400">{errors.githubOwner}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                GitHub Repository <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={githubRepoRef.current}
                onChange={(e) => (githubRepoRef.current = e.target.value)}
                className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-sm text-slate-200 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.githubRepo 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-slate-700 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.githubRepo && (
                <p className="mt-1 text-xs text-red-400">{errors.githubRepo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                GitHub API Key (Optional)
              </label>
              <input
                type="password"
                value={githubApiKeyRef.current}
                onChange={(e) => (githubApiKeyRef.current = e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Jira Domain <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                placeholder="yourcompany.atlassian.net"
                value={jiraDomainRef.current}
                onChange={(e) => (jiraDomainRef.current = e.target.value)}
                className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-sm text-slate-200 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.jiraDomain 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-slate-700 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.jiraDomain && (
                <p className="mt-1 text-xs text-red-400">{errors.jiraDomain}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Jira Project Key <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={jiraProjectKeyRef.current}
                  onChange={(e) => (jiraProjectKeyRef.current = e.target.value)}
                  className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-sm text-slate-200 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.jiraProjectKey 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-slate-700 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors.jiraProjectKey && (
                  <p className="mt-1 text-xs text-red-400">{errors.jiraProjectKey}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Jira Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={jiraEmailRef.current}
                  onChange={(e) => (jiraEmailRef.current = e.target.value)}
                  className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-sm text-slate-200 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.jiraEmail 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-slate-700 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors.jiraEmail && (
                  <p className="mt-1 text-xs text-red-400">{errors.jiraEmail}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Jira API Key (Optional)
              </label>
              <input
                type="password"
                value={jiraApiKeyRef.current}
                onChange={(e) => (jiraApiKeyRef.current = e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-600 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={Object.keys(errors).length > 0}
            className="px-6 py-2.5 bg-blue-600/90 hover:bg-blue-600 text-white rounded-xl border border-blue-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
