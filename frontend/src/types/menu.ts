export interface Menu {
  id: string;
  name: string;
  url?: string;
  icon?: string;
  order: number;
  parentId: string | null;
  depth: number;
  children?: Menu[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuDto {
  name: string;
  url?: string;
  icon?: string;
  order?: number;
  parentId?: string | null;
}

export interface UpdateMenuDto {
  name?: string;
  url?: string;
  icon?: string;
  order?: number;
  parentId?: string | null;
}

export interface MoveMenuDto {
  newParentId?: string | null;
}

export interface ReorderMenuDto {
  newOrder: number;
}
