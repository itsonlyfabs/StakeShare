// Local mock data to replace Base44 entities
export const mockData = {
  programs: [
    {
      id: '1',
      name: 'Creator Partnership Program',
      description: 'Join our exclusive creator partnership program and earn rewards for promoting our products.',
      status: 'active',
      requirements: 'Minimum 10K followers, active content creator, engaged audience',
      max_applicants: 100,
      application_deadline: '2024-12-31',
      auto_approve: false,
      created_at: '2024-01-15'
    },
    {
      id: '2',
      name: 'Influencer Marketing Campaign',
      description: 'Collaborate with us on our latest influencer marketing campaign.',
      status: 'active',
      requirements: 'Minimum 5K followers, experience in tech/finance content',
      max_applicants: 50,
      application_deadline: '2024-11-30',
      auto_approve: false,
      created_at: '2024-02-01'
    }
  ],
  
  creators: [
    {
      id: '1',
      name: 'Sarah Johnson',
      username: 'sarah_creator',
      email: 'sarah@example.com',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      location: 'New York, NY',
      followers_count: 25000,
      profile_url: 'https://instagram.com/sarah_creator',
      bio: 'Tech and lifestyle content creator',
      created_at: '2024-01-10'
    },
    {
      id: '2',
      name: 'Mike Chen',
      username: 'mike_tech',
      email: 'mike@example.com',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'San Francisco, CA',
      followers_count: 18000,
      profile_url: 'https://youtube.com/mike_tech',
      bio: 'Tech reviewer and developer',
      created_at: '2024-01-20'
    },
    {
      id: '3',
      name: 'Emma Davis',
      username: 'emma_fashion',
      email: 'emma@example.com',
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      location: 'Los Angeles, CA',
      followers_count: 35000,
      profile_url: 'https://tiktok.com/emma_fashion',
      bio: 'Fashion and beauty influencer',
      created_at: '2024-02-05'
    }
  ],
  
  applications: [
    {
      id: '1',
      program_id: '1',
      creator_id: '1',
      status: 'approved',
      message: 'I would love to join this program! I have experience in tech content and a highly engaged audience.',
      created_at: '2024-01-20',
      updated_at: '2024-01-25'
    },
    {
      id: '2',
      program_id: '1',
      creator_id: '2',
      status: 'under_review',
      message: 'Interested in this opportunity. I have a tech-focused audience that would be perfect for your products.',
      created_at: '2024-02-10',
      updated_at: '2024-02-10'
    },
    {
      id: '3',
      program_id: '2',
      creator_id: '3',
      status: 'applied',
      message: 'I specialize in fashion and beauty but also cover tech topics. Would love to collaborate!',
      created_at: '2024-02-15',
      updated_at: '2024-02-15'
    }
  ],
  
  companies: [
    {
      id: '1',
      name: 'Stake Share Inc.',
      description: 'A platform connecting creators with brands for mutually beneficial partnerships.',
      website: 'https://stakeshare.com',
      industry: 'Technology',
      size: 'Startup',
      created_at: '2024-01-01'
    }
  ]
};

// Local entity classes that mimic Base44 entities
export class LocalEntity {
  constructor(data) {
    Object.assign(this, data);
  }

  static entityKey() {
    // Basic pluralization with overrides for irregular nouns
    const name = this.name.toLowerCase();
    const overrides = { company: 'companies' };
    return overrides[name] || `${name}s`;
  }

  static async get(id) {
    const entityType = this.entityKey();
    const entity = mockData[entityType]?.find(item => item.id === id);
    if (!entity) throw new Error(`${this.name} not found`);
    return new this(entity);
  }

  static async list(filters = {}) {
    const entityType = this.entityKey();
    let entities = mockData[entityType] || [];
    
    // Apply filters
    if (filters.program_id) {
      entities = entities.filter(entity => entity.program_id === filters.program_id);
    }
    
    if (filters.created_by) {
      entities = entities.filter(entity => entity.created_by === filters.created_by);
    }
    
    if (filters.email) {
      entities = entities.filter(entity => entity.email === filters.email);
    }
    
    return entities.map(entity => new this(entity));
  }

  static async filter(filters = {}) {
    return this.list(filters);
  }

  static async create(data) {
    const entityType = this.entityKey();
    const newEntity = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    if (!mockData[entityType]) mockData[entityType] = [];
    mockData[entityType].push(newEntity);
    return new this(newEntity);
  }

  static async update(id, data) {
    const entityType = this.entityKey();
    const index = mockData[entityType].findIndex(entity => entity.id === id);
    if (index === -1) throw new Error(`${this.name} not found`);
    
    mockData[entityType][index] = {
      ...mockData[entityType][index],
      ...data,
      updated_at: new Date().toISOString()
    };
    
    return new this(mockData[entityType][index]);
  }

  static async delete(id) {
    const entityType = this.entityKey();
    const index = mockData[entityType].findIndex(entity => entity.id === id);
    if (index === -1) throw new Error(`${this.name} not found`);
    
    mockData[entityType].splice(index, 1);
    return true;
  }
}

export class Program extends LocalEntity {}
export class Creator extends LocalEntity {}
export class Application extends LocalEntity {}
export class Company extends LocalEntity {
  static entityKey() { return 'companies'; }
}

// Mock auth system
export const auth = {
  currentUser: {
    id: '1',
    email: 'admin@stakeshare.com',
    name: 'Admin User',
    role: 'admin',
    preferred_dashboard: 'founder'
  },
  
  // Add the missing methods that the code expects
  me: async () => {
    return auth.currentUser;
  },
  
  logout: async () => {
    return true;
  },
  
  updateMyUserData: async (data) => {
    Object.assign(auth.currentUser, data);
    return auth.currentUser;
  },
  
  signIn: async (email, password) => {
    // Mock authentication
    if (email === 'admin@stakeshare.com' && password === 'password') {
      return { user: auth.currentUser, token: 'mock-token' };
    }
    throw new Error('Invalid credentials');
  },
  
  signOut: async () => {
    return true;
  },
  
  isAuthenticated: () => true
};

// Mock integrations
export const integrations = {
  Core: {
    InvokeLLM: async (prompt) => `Mock AI response to: ${prompt}`,
    SendEmail: async (to, subject, body) => `Mock email sent to ${to}: ${subject}`,
    UploadFile: async (file) => `Mock file uploaded: ${file.name}`,
    GenerateImage: async (prompt) => `Mock image generated for: ${prompt}`,
    ExtractDataFromUploadedFile: async (file) => `Mock data extracted from: ${file.name}`
  }
};

// Add EligibilityRule class that CreateProgram.jsx needs
export class EligibilityRule extends LocalEntity {
  static async bulkCreate(rules) {
    const newRules = rules.map(rule => ({
      ...rule,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    // Add to mock data
    if (!mockData.eligibilityRules) {
      mockData.eligibilityRules = [];
    }
    mockData.eligibilityRules.push(...newRules);
    
    return newRules.map(rule => new this(rule));
  }
}
