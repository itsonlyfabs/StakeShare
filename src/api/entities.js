// Local entities instead of Base44
import { Program, Creator, Application, Company, auth } from './localData';

export { Program, Creator, Application, Company, auth };

// Additional entities that might be needed
export const EligibilityRule = {
  async create(data) {
    return { id: Date.now().toString(), ...data };
  }
};

export const Conversion = {
  async create(data) {
    return { id: Date.now().toString(), ...data };
  }
};

export const Payout = {
  async create(data) {
    return { id: Date.now().toString(), ...data };
  }
};

export const CreatorLink = {
  async create(data) {
    return { id: Date.now().toString(), ...data };
  }
};

export const LinkClick = {
  async create(data) {
    return { id: Date.now().toString(), ...data };
  }
};

export const Conversation = {
  async create(data) {
    return { id: Date.now().toString(), ...data };
  }
};

export const Message = {
  async create(data) {
    return { id: Date.now().toString(), ...data };
  }
};

export const BlogSubscriber = {
  async create(data) {
    return { id: Date.now().toString(), ...data };
  }
};

export const User = auth;