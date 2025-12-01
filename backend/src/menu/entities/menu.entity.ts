import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('menus')
export class Menu {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'The unique identifier of the menu item' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Dashboard', description: 'The name of the menu item' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ example: '/dashboard', description: 'The URL or route path', required: false })
  @Column({ type: 'varchar', length: 500, nullable: true })
  url: string;

  @ApiProperty({ example: 'dashboard-icon', description: 'Icon identifier', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  icon: string;

  @ApiProperty({ example: 1, description: 'Display order within the same level' })
  @Column({ type: 'int', default: 0 })
  order: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Parent menu ID', required: false })
  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  @ApiProperty({ example: 0, description: 'Depth level in the tree (0 = root)' })
  @Column({ type: 'int', default: 0 })
  depth: number;

  @ApiProperty({ description: 'Parent menu item', required: false, type: () => Menu })
  @ManyToOne(() => Menu, (menu) => menu.children, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  parent: Menu;

  @ApiProperty({ description: 'Child menu items', type: () => [Menu] })
  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
