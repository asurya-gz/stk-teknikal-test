import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MoveMenuDto } from './dto/move-menu.dto';
import { ReorderMenuDto } from './dto/reorder-menu.dto';
import { Menu } from './entities/menu.entity';

@ApiTags('menus')
@Controller('api/menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiBody({ type: CreateMenuDto })
  @ApiResponse({
    status: 201,
    description: 'Menu item has been successfully created.',
    type: Menu,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Parent menu not found.' })
  async create(@Body() createMenuDto: CreateMenuDto): Promise<Menu> {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all menu items in tree structure' })
  @ApiResponse({
    status: 200,
    description: 'Return all menu items.',
    type: [Menu],
  })
  async findAll(): Promise<Menu[]> {
    return this.menuService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single menu item by ID' })
  @ApiParam({ name: 'id', description: 'Menu ID (UUID)', type: String })
  @ApiResponse({
    status: 200,
    description: 'Return the menu item.',
    type: Menu,
  })
  @ApiResponse({ status: 404, description: 'Menu not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Menu> {
    return this.menuService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a menu item' })
  @ApiParam({ name: 'id', description: 'Menu ID (UUID)', type: String })
  @ApiBody({ type: UpdateMenuDto })
  @ApiResponse({
    status: 200,
    description: 'Menu item has been successfully updated.',
    type: Menu,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Menu not found.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ): Promise<Menu> {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a menu item and all its children' })
  @ApiParam({ name: 'id', description: 'Menu ID (UUID)', type: String })
  @ApiResponse({
    status: 204,
    description: 'Menu item has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Menu not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.menuService.remove(id);
  }

  @Patch(':id/move')
  @ApiOperation({ summary: 'Move a menu item to a different parent' })
  @ApiParam({ name: 'id', description: 'Menu ID (UUID)', type: String })
  @ApiBody({ type: MoveMenuDto })
  @ApiResponse({
    status: 200,
    description: 'Menu item has been successfully moved.',
    type: Menu,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Menu not found.' })
  async move(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() moveMenuDto: MoveMenuDto,
  ): Promise<Menu> {
    return this.menuService.move(id, moveMenuDto);
  }

  @Patch(':id/reorder')
  @ApiOperation({ summary: 'Reorder a menu item within the same level' })
  @ApiParam({ name: 'id', description: 'Menu ID (UUID)', type: String })
  @ApiBody({ type: ReorderMenuDto })
  @ApiResponse({
    status: 200,
    description: 'Menu item has been successfully reordered.',
    type: Menu,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Menu not found.' })
  async reorder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() reorderMenuDto: ReorderMenuDto,
  ): Promise<Menu> {
    return this.menuService.reorder(id, reorderMenuDto);
  }
}
