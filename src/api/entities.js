// Local entities instead of Base44
import { Program, Creator, Application, Company, auth, EligibilityRule as EligibilityRuleClass } from './localData';

export { Program, Creator, Application, Company, auth };

// Re-export real class version (with bulkCreate) for CreateProgram
export const EligibilityRule = EligibilityRuleClass;

export const Conversion = {
  async create(data) {
    return { id: Date.now().toString(), ...data };
  },
  async list() {
    // No conversions in local mock yet; return empty list
    return [];
  }
};

export const Payout = {
  async create(data) {
    return { id: Date.now().toString(), ...data };
  },
  async list() {
    return [];
  }
};

export const CreatorLink = {
  async create(data) {
    return { id: Date.now().toString(), ...data };
  },
  async list() {
    return [];
  }
};

export const LinkClick = {
  async create(data) {
    return { id: Date.now().toString(), ...data };
  },
  async list() {
    return [];
  }
};

export const Conversation = {
  async create(data) {
    return { id: Date.now().toString(), ...data };
  },
  async list() {
    return [];
  }
};

export const Message = {
  async create(data) {
    return { id: Date.now().toString(), ...data };
  },
  async list() {
    return [];
  }
};

export const BlogSubscriber = {
  async create(data) {
    return { id: Date.now().toString(), ...data };
  },
  async list() {
    return [];
  }
};

export const User = auth;