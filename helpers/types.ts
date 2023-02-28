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
    listingId: number;
    tokenId: number;
    price: number;
    amount: number;
    seller: string;
    isActive: boolean;

    constructor(
        listingId: number,
        tokenId: number,
        price: number,
        amount: number,
        seller: string,
        isActive: boolean
    ) {
        this.listingId = listingId;
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
            parseInt(entry[3]._hex, 16),
            entry[4],
            entry[5]
        );
    }
}

class GroupInvestment {
    investmentId: number;
    listingId: number;
    investors: string[];
    sharesAmounts: number[];
    accepted: string[];
    isActive: boolean;

    constructor(
        investmentId: number,
        listingId: number,
        investors: string[],
        sharesAmounts: number[],
        accepted: string[],
        isActive: boolean
    ) {
        this.investmentId = investmentId;
        this.listingId = listingId;
        this.investors = investors;
        this.sharesAmounts = sharesAmounts;
        this.accepted = accepted;
        this.isActive = isActive;
    }

    static fromSingleEntry(entry: any): GroupInvestment {
        return new GroupInvestment(
            parseInt(entry[0]._hex, 16),
            parseInt(entry[1]._hex, 16),
            entry[2],
            entry[3],
            entry[4],
            entry[5]
        );
    }
}

class FixedRental {
    rentalId: number;
    tokenId: number;
    renter: string;
    start: number;
    end: number;
    price: number;
    votes: number;
    approved: string[];
    isApproved: boolean;

    constructor(
        entry: any
    ) {
        this.rentalId = parseInt(entry[0]._hex, 16);
        this.tokenId = parseInt(entry[1]._hex, 16);
        this.renter = entry[2];
        this.start = parseInt(entry[3]._hex, 16);
        this.end = parseInt(entry[4]._hex, 16);
        this.price = parseInt(entry[5]._hex, 16);
        this.votes = parseInt(entry[6]._hex, 16);
        this.approved = entry[7];
        this.isApproved = entry[8];
    }
}

export { Asset, AssetCategory, AssetListing, SharesListing, GroupInvestment, FixedRental };
