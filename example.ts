// Example TypeScript file to test the AI Code Agent
// Try asking the AI to modify this file!

interface User {
  id: string;
  name: string;
  email: string;
}

export class UserService {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  getUser(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getAllUsers(): User[] {
    return this.users;
  }

  deleteUser(id: string): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Try these prompts with the AI:
// 1. "Add error handling to the UserService class"
// 2. "Add a method to update user information"
// 3. "Add input validation to prevent duplicate users"
// 4. "Make the UserService use async/await with a database"
