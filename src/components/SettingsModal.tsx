import React, { useState } from "react";
import { PersistenceService } from "../services/persistenceService";

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [githubApiKey, setGithubApiKey] = useState(
    PersistenceService.getGithubApiKey() || "",
  );
  const [jiraApiKey, setJiraApiKey] = useState(
    PersistenceService.getJiraApiKey() || "",
  );
  const [githubOwner, setGithubOwner] = useState(
    PersistenceService.getGithubOwner() || "",
  );
  const [githubRepo, setGithubRepo] = useState(
    PersistenceService.getGithubRepo() || "",
  );
  const [jiraDomain, setJiraDomain] = useState(
    PersistenceService.getJiraDomain() || "",
  );
  const [jiraProjectKey, setJiraProjectKey] = useState(
    PersistenceService.getJiraProjectKey() || "",
  );
  const [jiraEmail, setJiraEmail] = useState(
    PersistenceService.getJiraEmail() || "",
  );

  const handleSave = () => {
    PersistenceService.saveGithubApiKey(githubApiKey);
    PersistenceService.saveJiraApiKey(jiraApiKey);
    PersistenceService.saveGithubOwner(githubOwner);
    PersistenceService.saveGithubRepo(githubRepo);
    PersistenceService.saveJiraDomain(jiraDomain);
    PersistenceService.saveJiraProjectKey(jiraProjectKey);
    PersistenceService.saveJiraEmail(jiraEmail);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-slate-800 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="space-y-4">
          <div className="bg-yellow-900 border border-yellow-700 text-yellow-100 px-4 py-3 rounded-lg">
            <h3 className="font-bold">Security Warning</h3>
            <p className="text-sm">
              Storing API keys in your browser's local storage is not secure.
              Anyone with access to your browser could potentially steal them.
              Use with caution.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400">
              GitHub API Key
            </label>
            <input
              type="password"
              value={githubApiKey}
              onChange={(e) => setGithubApiKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400">
              Jira API Key
            </label>
            <input
              type="password"
              value={jiraApiKey}
              onChange={(e) => setJiraApiKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400">
              GitHub Owner
            </label>
            <input
              type="text"
              value={githubOwner}
              onChange={(e) => setGithubOwner(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400">
              GitHub Repo
            </label>
            <input
              type="text"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400">
              Jira Domain
            </label>
            <input
              type="text"
              value={jiraDomain}
              onChange={(e) => setJiraDomain(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400">
              Jira Project Key
            </label>
            <input
              type="text"
              value={jiraProjectKey}
              onChange={(e) => setJiraProjectKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400">
              Jira Email
            </label>
            <input
              type="text"
              value={jiraEmail}
              onChange={(e) => setJiraEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
