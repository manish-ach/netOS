"use client";

import { useState, useEffect, useCallback } from 'react';
import { GitHubRepository, GitHubUser, GitHubService } from '../services/github';

interface UseGitHubDataReturn {
  repositories: GitHubRepository[];
  user: GitHubUser | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGitHubData = (): UseGitHubDataReturn => {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [reposData, userData] = await Promise.all([
        GitHubService.getUserRepositories(),
        GitHubService.getUserInfo()
      ]);
      
      setRepositories(reposData);
      setUser(userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch GitHub data';
      setError(errorMessage);
      console.error('GitHub data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    repositories,
    user,
    loading,
    error,
    refetch: fetchData
  };
};
