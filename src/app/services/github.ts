export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  topics: string[];
  homepage: string | null;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

export class GitHubService {
  private static readonly BASE_URL = 'https://api.github.com';
  private static readonly USERNAME = 'manish-ach';

  static async getUserRepositories(): Promise<GitHubRepository[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/users/${this.USERNAME}/repos?sort=updated&per_page=20`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      const repos: GitHubRepository[] = await response.json();
      
      // Filter out forked repositories and only show original projects
      return repos.filter(repo => !repo.full_name.includes('forked') && !repo.name.includes('fork'));
    } catch (error) {
      console.error('Error fetching GitHub repositories:', error);
      throw error;
    }
  }

  static async getUserInfo(): Promise<GitHubUser> {
    try {
      const response = await fetch(`${this.BASE_URL}/users/${this.USERNAME}`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching GitHub user info:', error);
      throw error;
    }
  }

  static getLanguageColor(language: string | null): string {
    const colors: Record<string, string> = {
      'JavaScript': '#f7df1e',
      'TypeScript': '#3178c6',
      'Python': '#3776ab',
      'Java': '#f89820',
      'C++': '#00599c',
      'C#': '#239120',
      'Go': '#00add8',
      'Rust': '#000000',
      'PHP': '#777bb4',
      'Ruby': '#cc342d',
      'Swift': '#fa7343',
      'Kotlin': '#7f52ff',
      'HTML': '#e34f26',
      'CSS': '#1572b6',
      'SCSS': '#cf649a',
      'Shell': '#89e051',
      'Dockerfile': '#2496ed',
      'Vue': '#4fc08d',
      'React': '#61dafb',
      'Next.js': '#000000',
      'Node.js': '#339933',
    };
    
    return colors[language || ''] || '#6b7280';
  }

  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  }
}
