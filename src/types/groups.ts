type User = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type Member = {
  id: string;
  userId: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
};

type Todo = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
};

export type Group = {
  id: string;
  name: string;
  inviteCode: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  members: Member[];
  createdBy: User;
  todos: Todo[];
};
