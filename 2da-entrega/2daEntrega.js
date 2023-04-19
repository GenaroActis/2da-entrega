const fs = require('fs')

class ProductManager {
    constructor() {
        this.pathProducts = './productsAdded.json';
        this.pathCart = './productsCart.json';
        this.newId = 0;
    }
    async getProducts(){
        try{
            if(fs.existsSync(this.pathProducts)){
                const productsJSON = await fs.promises.readFile(this.pathProducts, 'utf-8');
                const products = JSON.parse(productsJSON);
                return products
            } else{
                return []
            }
        } catch (error){
            console.log(error)
        }
    }
    async createProducts(product){
        try{
            const productsFile = await this.getProducts();
            let findCode = await this.repeatedCode(product.code, productsFile)
            if(findCode){
                console.log("ya existe un producto con este code")
            }else{
                product.id = this.generateId(),
                product.amount = 0
                productsFile.push(product);
                await fs.promises.writeFile(this.pathProducts, JSON.stringify(productsFile));
            }
        } catch (error){
            console.log(error);
        }
    }
    async repeatedCode(code, productsFile){
        try{
            const findCode = productsFile.find((prodIterated) => prodIterated.code === code);
            return findCode
        }catch(error){
            console.log(error)
        }
    }
    generateId() {
        return ++this.newId;
    }
    async upDateProduct(id, upDateKey, upDateValue){
        try{
            if(upDateKey === 'name' || upDateKey === 'price' || upDateKey === 'description' || upDateKey === 'thumbnail' || upDateKey === 'code' || upDateKey === 'stock'){
                let productsFile = await this.getProducts();
                let productFind = await this.findProductById(id, this.getProducts());
                productsFile = productsFile.filter((product) => product.id !== id);
                productFind[upDateKey] = upDateValue
                productsFile.push(productFind)
                await fs.promises.writeFile(this.pathProducts, JSON.stringify(productsFile));
            }else{
                console.log('Error: upDateKey debe ser una propieda valida');
            }
        }catch (error){
            console.log(error);
        }    
    }
    // cart functions

    async getCart(){
        try{
            if(fs.existsSync(this.pathCart)){
                const productsCartJSON = await fs.promises.readFile(this.pathCart, 'utf-8');
                const productsCart = JSON.parse(productsCartJSON);
                return productsCart
            }else{
                await fs.promises.writeFile(this.pathCart, JSON.stringify([]));
                const productsCartJSON = await fs.promises.readFile(this.pathCart, 'utf-8');
                const productsCart = JSON.parse(productsCartJSON);
                return productsCart
            }
        } catch (error){
            console.log(error)
        }
    }  
    
    async addProductToCart(id){
        const productFindAdded = await this.findProductById(id, this.getProducts());
        if(productFindAdded === null){
            console.log("el producto que intentas agregar no existe")
        }else{
            let productsCart = await this.getCart();
            let productFindCart = await this.findProductById(id, this.getCart());
            if(productFindCart === null){
                productFindAdded.amount = 1
                productFindAdded.unitPrice = productFindAdded.price
                productsCart.push(productFindAdded)
            } else{
                productsCart = productsCart.filter((product) => product.id !== id);
                productFindCart.amount ++;
                productFindCart.price = productFindCart.unitPrice * productFindCart.amount
                productsCart.push(productFindCart)
            }
            await fs.promises.writeFile(this.pathCart, JSON.stringify(productsCart));
        }
    }
    async deleteProduct(id){
        const productFind = await this.findProductById(id, this.getCart())
        let productsCart = await this.getCart();
        if (productFind === null){
            console.log("El producto que intentas eliminar no existe en el carrito")
        } else {
            if(productFind.amount < 2){
                productsCart = productsCart.filter((product) => product.id !== productFind.id);
            } else{
                productsCart = productsCart.filter((product) => product.id !== id);
                productFind.amount = productFind.amount-1 
                productFind.price = productFind.unitPrice * productFind.amount
                productsCart.push(productFind)
            }
            await fs.promises.writeFile(this.pathCart, JSON.stringify(productsCart));
        }
    }
    async findProductById(searchedId, get){
        try{
            const products = await get;
            const find = products.find((prodIterated) => prodIterated.id === searchedId);
            if (find){
                return find;
            } else {
                return null;
            }
        } catch(error){
            console.log(error)
        }
    }
}

const manager = new ProductManager();

const product1 = {
    name:"Gorra",
    description:"Polo RL",
    price:5000,
    thumbnail:"https://res.cloudinary.com/dsdicaf5h/image/upload/v1678451446/cenicero/54_vpuz2h.png",
    code: "2812023GPRLBE",
    stock: 3,
}
const product4 = {
    name:"Gorra",
    description:"Polo RL",
    price:5000,
    thumbnail:"https://res.cloudinary.com/dsdicaf5h/image/upload/v1678451446/cenicero/54_vpuz2h.png",
    code: "2812023GPRLBE",
    stock: 3,
}
const product2 = {
    name:"Chomba",
    description:"Nike Golf",
    price:7000,
    thumbnail:"https://res.cloudinary.com/dsdicaf5h/image/upload/v1678451438/cenicero/94_ea9ghh.png",
    code: "02012022CNGBE",
    stock: 4,
}
const product3 = {
    name:"Chomba",
    description:"Chaps RL",
    price:7000,
    thumbnail:"https://res.cloudinary.com/dsdicaf5h/image/upload/v1678451430/cenicero/131_extbeh.png",
    code: "04122022CCRLBE",
    stock: 2,
}
const test = async() => {
    const get = await manager.getProducts();
    console.log('primer consulta productos', get);
    await manager.createProducts(product1);
    await manager.createProducts(product2);
    await manager.createProducts(product3);
    await manager.createProducts(product4);
    await manager.upDateProduct(3, "price", 9000);
    const get2 = await manager.getProducts();
    console.log('segunda consulta productos', get2);
    const get3 = await manager.getCart();
    console.log('tercera consulta carrito', get3);
    await manager.addProductToCart(2);
    await manager.addProductToCart(3);
    await manager.addProductToCart(3);
    await manager.addProductToCart(3);
    const get4 = await manager.getCart();
    console.log('cuarta consulta carrito',get4);
    await manager.deleteProduct(3);
    await manager.deleteProduct(2);
    const get5 = await manager.getCart();
    console.log('quinta consulta carrito',get5);
}
test();



