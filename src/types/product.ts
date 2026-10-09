export interface MarketPrice {
market?: string;
marketName?: string;
name?: string;
price?: number | string;
location?: string;
updatedAt?: string;
}

export interface Product {
id: string | number;
name: string;
slug?: string;
category?: string;
categoryName?: string;
image?: string;
imageUrl?: string;
emoji?: string;
price?: number | string;
unit?: string;
description?: string;
minPrice?: number | string;
maxPrice?: number | string;
averagePrice?: number | string;
previousPrice?: number | string;
priceChange?: number | string;
trend?: string;
markets?: MarketPrice[];
createdAt?: string;
updatedAt?: string;
}
