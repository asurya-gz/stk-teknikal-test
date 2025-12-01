import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MoveMenuDto } from './dto/move-menu.dto';
import { ReorderMenuDto } from './dto/reorder-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const { parentId, order, ...rest } = createMenuDto;

    // Validate parent exists if parentId is provided
    if (parentId) {
      const parent = await this.menuRepository.findOne({
        where: { id: parentId },
      });
      if (!parent) {
        throw new NotFoundException(`Parent menu with ID ${parentId} not found`);
      }
    }

    // Calculate depth based on parent
    const depth = await this.calculateDepth(parentId);

    // Get max order if not provided
    const finalOrder =
      order !== undefined
        ? order
        : await this.getNextOrder(parentId);

    const menu = this.menuRepository.create({
      ...rest,
      parentId: parentId || null,
      order: finalOrder,
      depth,
    });

    return this.menuRepository.save(menu);
  }

  async findAll(): Promise<Menu[]> {
    // Get all menus and build tree structure
    const menus = await this.menuRepository.find({
      order: { depth: 'ASC', order: 'ASC' },
    });

    return this.buildTree(menus);
  }

  async findOne(id: string): Promise<Menu> {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.findOne(id);

    // Validate parent exists if parentId is being updated
    if (updateMenuDto.parentId !== undefined) {
      if (updateMenuDto.parentId === id) {
        throw new BadRequestException('Menu cannot be its own parent');
      }

      if (updateMenuDto.parentId) {
        const parent = await this.menuRepository.findOne({
          where: { id: updateMenuDto.parentId },
        });
        if (!parent) {
          throw new NotFoundException(
            `Parent menu with ID ${updateMenuDto.parentId} not found`,
          );
        }

        // Check if the new parent is not a descendant of this menu
        const isDescendant = await this.isDescendant(id, updateMenuDto.parentId);
        if (isDescendant) {
          throw new BadRequestException(
            'Cannot move menu to its own descendant',
          );
        }
      }

      // Update depth for this menu and all descendants
      const newDepth = await this.calculateDepth(updateMenuDto.parentId);
      await this.updateDepth(id, newDepth);
    }

    Object.assign(menu, updateMenuDto);
    return this.menuRepository.save(menu);
  }

  async remove(id: string): Promise<void> {
    const menu = await this.findOne(id);
    // CASCADE delete will handle children
    await this.menuRepository.remove(menu);
  }

  async move(id: string, moveMenuDto: MoveMenuDto): Promise<Menu> {
    const { newParentId } = moveMenuDto;

    const menu = await this.findOne(id);

    if (newParentId === id) {
      throw new BadRequestException('Menu cannot be its own parent');
    }

    // Validate new parent exists
    if (newParentId) {
      const newParent = await this.menuRepository.findOne({
        where: { id: newParentId },
      });
      if (!newParent) {
        throw new NotFoundException(
          `Parent menu with ID ${newParentId} not found`,
        );
      }

      // Check if the new parent is not a descendant of this menu
      const isDescendant = await this.isDescendant(id, newParentId);
      if (isDescendant) {
        throw new BadRequestException(
          'Cannot move menu to its own descendant',
        );
      }
    }

    // Update parent reference and FK
    menu.parentId = newParentId || null;
    menu.parent = newParentId
      ? ({ id: newParentId } as Menu)
      : null;

    // Get new order position
    menu.order = await this.getNextOrder(newParentId);

    // Save the parent change first
    await this.menuRepository.save(menu);

    // Update depth for this menu and all descendants
    const newDepth = await this.calculateDepth(newParentId);
    await this.updateDepth(id, newDepth);

    // Return the updated menu
    return this.findOne(id);
  }

  async reorder(id: string, reorderMenuDto: ReorderMenuDto): Promise<Menu> {
    const { newOrder } = reorderMenuDto;

    const menu = await this.findOne(id);

    // Get all siblings
    const siblings = await this.menuRepository.find({
      where: {
        parentId: menu.parentId || IsNull(),
      },
      order: { order: 'ASC' },
    });

    const oldOrder = menu.order;

    // Reorder siblings
    for (const sibling of siblings) {
      if (sibling.id === id) {
        sibling.order = newOrder;
      } else if (oldOrder < newOrder) {
        // Moving down: shift items up
        if (sibling.order > oldOrder && sibling.order <= newOrder) {
          sibling.order -= 1;
        }
      } else {
        // Moving up: shift items down
        if (sibling.order >= newOrder && sibling.order < oldOrder) {
          sibling.order += 1;
        }
      }
    }

    await this.menuRepository.save(siblings);

    return this.findOne(id);
  }

  // Helper methods

  private async calculateDepth(parentId: string | null): Promise<number> {
    if (!parentId) {
      return 0;
    }

    const parent = await this.menuRepository.findOne({
      where: { id: parentId },
    });

    return parent ? parent.depth + 1 : 0;
  }

  private async getNextOrder(parentId: string | null): Promise<number> {
    let query = this.menuRepository
      .createQueryBuilder('menu')
      .select('MAX(menu.order)', 'max');

    if (parentId === null) {
      query = query.where('menu.parentId IS NULL');
    } else {
      query = query.where('menu.parentId = :parentId', { parentId });
    }

    const maxOrder = await query.getRawOne();
    return maxOrder?.max !== null && maxOrder?.max !== undefined ? maxOrder.max + 1 : 0;
  }

  private buildTree(menus: Menu[], parentId: string | null = null): Menu[] {
    return menus
      .filter((menu) => menu.parentId === parentId)
      .map((menu) => ({
        ...menu,
        children: this.buildTree(menus, menu.id),
      }));
  }

  private async isDescendant(
    ancestorId: string,
    descendantId: string,
  ): Promise<boolean> {
    let current = await this.menuRepository.findOne({
      where: { id: descendantId },
    });

    while (current && current.parentId) {
      if (current.parentId === ancestorId) {
        return true;
      }
      current = await this.menuRepository.findOne({
        where: { id: current.parentId },
      });
    }

    return false;
  }

  private async updateDepth(menuId: string, newDepth: number): Promise<void> {
    const menu = await this.menuRepository.findOne({
      where: { id: menuId },
      relations: ['children'],
    });

    if (!menu) {
      return;
    }

    const depthDiff = newDepth - menu.depth;
    menu.depth = newDepth;
    await this.menuRepository.save(menu);

    // Update all descendants
    if (menu.children && menu.children.length > 0) {
      for (const child of menu.children) {
        await this.updateDepth(child.id, child.depth + depthDiff);
      }
    }
  }
}
