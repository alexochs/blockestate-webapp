enum AssetCategory {
    APARTMENT,
    HOUSE,
}

class Asset {
    tokenId: number;
    category: AssetCategory;
    street: string;
    number: number;
    apNumber: number;
    city: string;
    zip: string;
    country: string;

    constructor(
        tokenId: number,
        category: AssetCategory,
        street: string,
        number: number,
        apNumber: number,
        city: string,
        zip: string,
        country: string
    ) {
        this.tokenId = tokenId;
        this.category = category;
        this.street = street;
        this.number = number;
        this.apNumber = apNumber;
        this.city = city;
        this.zip = zip;
        this.country = country;
    }

    static fromSingleEntry(entry: any): Asset {
        return new Asset(
            parseInt(entry[0]._hex, 16),
            entry[1],
            entry[2][0],
            entry[2][1],
            entry[2][2],
            entry[2][3],
            entry[2][4],
            entry[2][5]
        );
    }
}

class AssetListing {
    tokenId: number;
    price: number;
    seller: string;
    buyer: string;
    isSold: boolean;
    isActive: boolean;

    constructor(
        tokenId: number,
        price: number,
        seller: string,
        buyer: string,
        isSold: boolean,
        isActive: boolean
    ) {
        this.tokenId = tokenId;
        this.price = price;
        this.seller = seller;
        this.buyer = buyer;
        this.isSold = isSold;
        this.isActive = isActive;
    }

    static fromSingleEntry(entry: any): AssetListing {
        return new AssetListing(
            parseInt(entry[0]._hex, 16),
            parseInt(entry[1]._hex, 16),
            entry[2],
            entry[3],
            entry[4],
            entry[5]
        );
    }
}

class SharesListing {
    tokenId: number;
    price: number;
    amount: number;
    seller: string;
    isActive: boolean;

    constructor(
        tokenId: number,
        price: number,
        amount: number,
        seller: string,
        isActive: boolean
    ) {
        this.tokenId = tokenId;
        this.price = price;
        this.amount = amount;
        this.seller = seller;
        this.isActive = isActive;
    }

    static fromSingleEntry(entry: any): SharesListing {
        return new SharesListing(
            parseInt(entry[0]._hex, 16),
            parseInt(entry[1]._hex, 16),
            parseInt(entry[2]._hex, 16),
            entry[3],
            entry[4]
        );
    }
}

export { Asset, AssetCategory, AssetListing, SharesListing };
