import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BasketItem, BasketService } from '../service/basket.service';
import { AddItemDTO } from '../dto/add-item.dto';
import { UpdateQtyDto } from '../dto/update-item.dto';
import { CheckoutDto, CheckoutItemDto } from '../dto/checkout.dto';

@Controller('basket')
export class BasketController {
    constructor(private readonly basketService: BasketService) {}

    @Post(':userId/items')
    async addItem(
        @Param('userId') userId: string,
        @Body() input: AddItemDTO
    ) {
        await this.basketService.addItem(userId, input);
        return { message: 'Item added to basket' };
    }

    @Get(':userId')
    async getBasket(@Param('userId') userId: string,): Promise<{ userId: string; items: BasketItem[] }> {
        const basket = await this.basketService.getBasket(userId);
        return { userId, items: basket };
    }

    @Patch(':userId/items/:product_variants_id')
    async updateQuantity(
        @Param('userId') userId: string,
        @Param('product_variants_id') product_variants_id: string,
        @Body() dto: UpdateQtyDto,
    ): Promise<BasketItem | { message: string }> {
        const updated = await this.basketService.updateQuantity(userId, product_variants_id, dto.quantity);
        return updated ?? { message: 'Item not found' };
    }


    @Delete(':userId/items/:product_variants_id')
    async removeItem(
        @Param('userId') userId: string,
        @Param('product_variants_id') product_variants_id: string,
    ) {
        await this.basketService.removeItem(userId, product_variants_id);
        return { message: 'Item removed' };
    }

    @Delete(':userId')
    async clearBasket(@Param('userId') userId: string) {
        await this.basketService.clearBasket(userId);
        return { message: 'Basket cleared' };
    }

    @Post(':userId')
    async checkoutBasket(
        @Param('userId') userId: string,
        @Body() input: CheckoutDto,
    ) {
        await this.basketService.checkout(userId, input);
        return { message: "checkout requested" };
    }

}
