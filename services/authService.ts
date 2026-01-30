
interface User {
  email: string;
  password?: string;
  verified: boolean;
}

const STORAGE_KEY = 'gowhere_users';

export const authService = {
  getUsers: (): User[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error parsing stored users:", error);
      return [];
    }
  },

  register: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate delay
    await new Promise(r => setTimeout(r, 1000));
    const users = authService.getUsers();
    
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'User already exists.' };
    }

    // New users are unverified by default for the demo logic
    const newUser: User = { email, password, verified: false };
    users.push(newUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Error saving users to storage:", error);
      return { success: false, error: 'Failed to save user' };
    }

    return { success: true };
  },

  login: async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    await new Promise(r => setTimeout(r, 1000));
    const users = authService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { success: false, error: 'Invalid credentials.' };
    }

    if (!user.verified) {
      return { success: false, error: 'Your email is not verified. Access restricted.' };
    }

    return { success: true, user };
  },

  // Helper to "verify" a user for testing
  verifyUser: (email: string) => {
    const users = authService.getUsers();
    const userIdx = users.findIndex(u => u.email === email);
    if (userIdx !== -1) {
      users[userIdx].verified = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  }
};
