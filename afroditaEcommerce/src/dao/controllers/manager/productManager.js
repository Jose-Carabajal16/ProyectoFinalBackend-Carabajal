import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    console.log(`ProductManager inicializado con el path: ${this.path}`);
  }

  // leer productos
  getProducts = async (info) => {
    try {
      const { limit } = info;
      console.log("obteniendo productos con limit:", limit);

      if (fs.existsSync(this.path)) {
        const productlist = await fs.promises.readFile(this.path, "utf-8");
        console.log("contenido del archivo leido:", productlist);
        const productlistJs = JSON.parse(productlist);

        if (limit) {
          const limitProducts = productlistJs.slice(0, parseInt(limit));
          console.log("productos limitados:", limitProducts);
          return limitProducts;
        } else {
          console.log("productos completos:", productlistJs);
          return productlistJs;
        }
      } else {
        console.log("el archivo de productos no existe.");
        return [];
      }
    } catch (error) {
      console.error("error al obtener productos:", error);
      throw new Error(error);
    }
  };

  // leer productos para la vista
  getProductsView = async () => {
    try {
      console.log("obteniendo productos para la vista");

      if (fs.existsSync(this.path)) {
        const productlist = await fs.promises.readFile(this.path, "utf-8");
        console.log("contenido del archivo leido para la vista:", productlist);
        const productlistJs = JSON.parse(productlist);
        return productlistJs;
      } else {
        console.log("el archivo de productos no existe.");
        return [];
      }
    } catch (error) {
      console.error("error al obtener productos para la vista:", error);
      throw new Error(error);
    }
  };

  // buscar producto por id
  getProductbyId = async (id) => {
    try {
      const { pid } = id;
      console.log(`buscando producto con id: ${pid}`);

      if (fs.existsSync(this.path)) {
        const allproducts = await this.getProducts({});
        const found = allproducts.find((element) => element.id === parseInt(pid));
        if (found) {
          console.log("producto encontrado:", found);
          return found;
        } else {
          console.error("producto no existe");
          throw new Error("producto no existe");
        }
      } else {
        console.error("archivo de productos no encontrado");
        throw new Error("product file not found");
      }
    } catch (error) {
      console.error("error al buscar producto por id:", error);
      throw new Error(error);
    }
  };

  // generar id
  generateId = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const productlist = await fs.promises.readFile(this.path, "utf-8");
        const productlistJs = JSON.parse(productlist);
        const counter = productlistJs.length;
        const newId = counter === 0 ? 1 : productlistJs[counter - 1].id + 1;
        console.log("nuevo id generado:", newId);
        return newId;
      }
    } catch (error) {
      console.error("error al generar id:", error);
      throw new Error(error);
    }
  };

  // crear un producto
  addProduct = async (obj) => {
    const { title, description, price, thumbnail, category, status = true, code, stock } = obj;
    if (!title || !description || !price || !category || !code || !status || !stock) {
      console.error("faltan datos para agregar el producto:", obj);
      return;
    } else {
      const listadoProductos = await this.getProducts({});
      const codigorepetido = listadoProductos.find(
        (elemento) => elemento.code === code
      );

      if (codigorepetido) {
        console.error("el codigo del producto es repetido:", code);
        return;
      } else {
        const id = await this.generateId();
        const productnew = {
          id,
          title,
          description,
          price,
          category,
          status,
          thumbnail,
          code,
          stock,
        };
        console.log("nuevo producto a agregar:", productnew);
        listadoProductos.push(productnew);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(listadoProductos, null, 2)
        );
        console.log("producto agregado correctamente");
      }
    }
  };

  // actualizar un producto
  updateProduct = async (id, obj) => {
    const { pid } = id;
    const { title, description, price, category, thumbnail, status, code, stock } = obj;
    if (title === undefined || description === undefined || price === undefined || category === undefined || status === undefined || code === undefined || stock === undefined) {
      console.error("faltan datos para actualizar el producto:", obj);
      return;
    } else {
      const listadoProductos = await this.getProducts({});
      const codigorepetido = listadoProductos.find((i) => i.code === code);

      if (codigorepetido) {
        console.error("el codigo del producto es repetido:", code);
        return;
      } else {
        const newProductsList = listadoProductos.map((elemento) => {
          if (elemento.id === parseInt(pid)) {
            const updatedProduct = {
              ...elemento,
              title,
              description,
              price,
              category,
              status,
              thumbnail,
              code,
              stock,
            };
            console.log("producto actualizado:", updatedProduct);
            return updatedProduct;
          } else {
            return elemento;
          }
        });
        await fs.promises.writeFile(this.path, JSON.stringify(newProductsList, null, 2));
        console.log("producto actualizado correctamente");
      }
    }
  };

  // eliminar un producto
  deleteProduct = async (id) => {
    const allproducts = await this.getProducts({});
    console.log("lista de productos antes de eliminar:", allproducts);
    const productswithoutfound = allproducts.filter(
      (elemento) => elemento.id !== parseInt(id)
    );
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(productswithoutfound, null, 2)
    );
    console.log("producto eliminado con id:", id);
    return "producto eliminado";
  };
}
