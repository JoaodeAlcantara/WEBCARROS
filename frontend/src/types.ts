export enum CategoryType {
    HATCH = 'HATCH',
    SEDAN = 'SEDAN',
    SUV = 'SUV',
    PICKUP = 'PICKUP',
    CONVERSIVEL = 'CONVERSIVEL',
    COUPE = 'COUPE',
    MINIVAN = 'MINIVAN',
    VAN = 'VAN',
    UTILITARIO = 'UTILITARIO',
    CROSSOVER = 'CROSSOVER',
    ESPORTIVO = 'ESPORTIVO',
    OFFROAD = 'OFFROAD',
    WAGON = 'WAGON',
    OUTRO = 'OUTRO',
}

export enum FuelType {
    GASOLINA = 'GASOLINA',
    ETANOL = 'ETANOL',
    FLEX = 'FLEX',
    DIESEL = 'DIESEL',
    GNV = 'GNV',
    ELETRICO = 'ELETRICO',
    HIBRIDO = 'HIBRIDO',
    OUTRO = 'OUTRO',
}

export enum StateType {
    disponivel = 'disponivel',
    vendido = 'vendido',
    oculto = 'oculto',
}

export enum TransmissionType {
    MANUAL = 'MANUAL',
    AUTOMATICO = 'AUTOMATICO',
    AUTOMATIZADO = 'AUTOMATIZADO',
    CVT = 'CVT',
    OUTRO = 'OUTRO',
}

export interface Car {
    images: any;
    id: number;
    name: string;
    model: string;
    highlight: string;
    transmission: TransmissionType;
    carImages: CarImage[];
    year: string;
    kilometersRun: number;
    price: string;
    category: CategoryType;
    fuel: FuelType;
    city: string;
    contactPhone: string;
    description: string;
    status: StateType;
    previousStatus: StateType;
    views: number;
    slug: string;
    userId: number;
    user?: User;
    favorites?: FavoriteItem[];
    createdAt: string;
}

export interface CarImage {
    id: number;
    filename: string;
    carId: number;
}

export interface FavoriteItem {
    id: number;
    userId: number;
    carId: number;
    group?: string;
    user?: User;
    car?: Car;
}

export interface FavoriteGroup {
    [groupName: string]: FavoriteItem[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string; 
    cars?: Car[];
    favorites?: FavoriteItem[];
}