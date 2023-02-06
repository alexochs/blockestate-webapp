enum AssetCategory {
    APARTMENT,
    HOUSE,
}

class Asset {
    tokenId: number;
    category: AssetCategory;
    street: string;
    number: number;
    city: string;
    country: string;

    constructor(
        tokenId: number,
        category: AssetCategory,
        street: string,
        number: number,
        city: string,
        country: string
    ) {
        this.tokenId = tokenId;
        this.category = category;
        this.street = street;
        this.number = number;
        this.city = city;
        this.country = country;
    }

    static fromSingleEntry(entry: any): Asset {
        return new Asset(
            parseInt(entry[0]._hex, 16),
            entry[1],
            entry[2][0],
            entry[2][1],
            entry[2][2],
            entry[2][3]
        );
    }
}

export { Asset, AssetCategory };
