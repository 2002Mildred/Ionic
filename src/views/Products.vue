<template>
  <ion-content>

    <ion-row>
      <ion-col size="12">
        <h1 class="ion-text-center">Administrar Productos</h1>
      </ion-col>
    </ion-row>
    
    <ion-row>
      <ion-col size="12">
        <ion-select v-model="selectedCategory" @ionChange="getProductsByCategory(selectedCategory)">
          <ion-select-option value="">Todos</ion-select-option>
          <ion-select-option v-for="category in categories" :value="category" :key="category">{{ category }}</ion-select-option>
        </ion-select>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col size="12" class="ion-text-center">
        <ion-item>
          <ion-label>Filtrar por categoría</ion-label>
          <ion-toggle v-model="categoryFilterActive" :disabled="!selectedCategory"></ion-toggle>
        </ion-item>
      </ion-col>
    </ion-row>
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="setOpen(true)">
        <ion-icon name="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <space></space>
    <ion-row>
      <br>
      <ion-col size="3.5" v-for="(product, index) in products" :key="index">
        <ion-card class="flex-container">
          <img :src="product.imagenArchivo" alt="Product image" width="250" height="250">
          <ion-card-content class="card-content">
            <ion-card-title>{{ product.nombre }}</ion-card-title>
            <ion-card-subtitle>{{ product.resumen }}</ion-card-subtitle>
            <ion-card-text>{{ product.descripcion }}</ion-card-text>
            <ion-button expand="block" @click="prepareUpdate(product)">Editar</ion-button>
            <ion-button expand="block" color="danger" @click="prepareDelete(product)">Eliminar</ion-button>
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>

    <ion-modal :is-open="isOpenRef" css-class="my-custom-class" :swipe-to-close="true"
      :presenting-element="$parent.$refs.ionRouterOutlet" @didDismiss="setOpen(false)">
      <ion-content>
        <ion-item>
          <ion-label position="floating">Nombre</ion-label>
          <ion-input v-model="newProduct.nombre"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Categoria</ion-label>
          <ion-input v-model="newProduct.categoria"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Resumen</ion-label>
          <ion-input v-model="newProduct.resumen"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Descripcion</ion-label>
          <ion-input v-model="newProduct.descripcion"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Imagen Archivo</ion-label>
          <ion-input v-model="newProduct.imagenArchivo"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Precio</ion-label>
          <ion-input v-model="newProduct.precio"></ion-input>
        </ion-item>

        <ion-button expand="full" @click="createProduct">Create Product</ion-button>
      </ion-content>
    </ion-modal>

    <ion-modal :is-open="updateDialog" css-class="my-custom-class" :swipe-to-close="true"
      :presenting-element="$parent.$refs.ionRouterOutlet">
      <ion-content>
        <ion-item>
          <ion-label position="floating">Nombre</ion-label>
          <ion-input v-model="productToUpdate.nombre"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Cataegorias</ion-label>
          <ion-input v-model="productToUpdate.categoria"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Resumen</ion-label>
          <ion-input v-model="productToUpdate.resumen"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Descripcion</ion-label>
          <ion-input v-model="productToUpdate.descripcion"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Imagen Archivo</ion-label>
          <ion-input v-model="productToUpdate.imagenArchivo"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Precio</ion-label>
          <ion-input v-model="productToUpdate.precio"></ion-input>
        </ion-item>

        <ion-button expand="full" @click="updateProduct(productToUpdate)">Actualizar Producto</ion-button>
      </ion-content>
    </ion-modal>
  </ion-content>
</template>
<script>
import ProductService from "@/services/ProductService";
import { IonModal, IonButton, IonContent, IonPage, IonItem, IonInput, IonLabel, IonSelect, IonSelectOption, IonToggle } from '@ionic/vue';  
import { defineComponent, ref } from 'vue';  

export default {
  components: { IonModal, IonButton,  IonContent, IonPage, IonItem, IonInput, IonLabel, IonSelect, IonSelectOption,IonToggle  },
  data() {
    return {
      products: [],
      filteredProducts: [],
      deleteDialog: false,
      createDialog: false,
      productToDelete: null,
      newProduct: {
        nombre: "",
        categoria: "",
        resumen: "",
        descripcion: "",
        imagenArchivo: "",
        precio: "",
      },
      updateDialog: false,
      productToUpdate: {
        id: "",
        nombre: "",
        categoria: "",
        resumen: "",
        descripcion: "",
        imagenArchivo: "",
        precio: "",
      },
      snackbar: {
        visible: false,
        message: "",
        timeout: 3000,
        color: "red",
      },
      categoryFilterActive: false,
      categories: [],
      selectedCategory: "",
      headers: [
        { text: "Nombre", value: "nombre" },
        { text: "Resumen", value: "resumen" },
        { text: "Descripción", value: "descripcion" },
        { text: "Acciones", value: "actions", sortable: false },
      ],
    };
  },
  async created() {
    const response = await ProductService.getProducts();
    this.products = response.data;
    this.filteredProducts = this.products;
    this.getCategories();
  },
  methods: {
    openCreateDialog() {
      this.createDialog = true;
    },
    prepareUpdate(product) {
      this.productToUpdate = { ...product };
      this.updateDialog = true;
    },
    showSnackbar(message, color = "red", timeout = 3000) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.timeout = timeout;
      this.snackbar.visible = true;
    },
    goToProduct(id) {
      this.$router.push({ name: "ProductDetails", params: { id } });
    },
    async updateProduct(product) {
      try {
        await ProductService.updateProduct(product);
        this.updateDialog = false;
        const response = await ProductService.getProducts();
        this.products = response.data;
        this.filteredProducts = this.products;

        // Add snackbar here
        this.showSnackbar("Producto actualizado exitosamente.", "green");
      } catch (error) {
        this.showSnackbar("Error al actualizar el producto.");
        console.error("Error al actualizar el producto:", error);
      }
    },

    prepareDelete(product) {
      this.productToDelete = product;
      this.deleteDialog = true;
    },
    async deleteProduct() {
      if (this.productToDelete) {
        try {
          await ProductService.deleteProduct(this.productToDelete.id);
          this.productToDelete = null;
          const response = await ProductService.getProducts();
          this.products = response.data;
          this.filteredProducts = this.products;

          // Add snackbar here
          this.showSnackbar("Producto eliminado exitosamente.", "green");
        } catch (error) {
          this.showSnackbar("Error al eliminar el producto.");
          console.error("Error al eliminar el producto:", error);
        }
      }
      this.deleteDialog = false;
    },

    getCategories() {
      const categoriesSet = new Set(
        this.products.map((product) => product.categoria)
      );
      this.categories = [...categoriesSet];
    },

    filterProducts() {
      if (this.selectedCategory) {
        this.filteredProducts = this.products.filter(
          (product) => product.categoria === this.selectedCategory
        );
      } else {
        this.filteredProducts = this.products;
      }
    },

    async getProducts() {
      try {
        const response = await ProductService.getProducts();
        this.products = response.data;
        this.filteredProducts = this.products;
        this.categoryFilterActive = false;
      } catch (error) {
        this.showSnackbar("Error al obtener los productos.");
        console.error("Error al obtener los productos:", error);
      }
    },
    async getProductsByCategory(category) {
      try {
        this.categoryFilterActive = true;
        const response = await ProductService.getProductsByCategory(category);
        this.products = response.data;
        this.filteredProducts = this.products;

        // Add snackbar here
        this.showSnackbar(
          "Productos obtenidos por categoría exitosamente.",
          "green"
        );
      } catch (error) {
        this.showSnackbar("Error al obtener los productos por categoría.");
        console.error("Error al obtener los productos por categoría:", error);
      }
    },

    async getProductsBasedOnSwitch() {
      try {
        if (this.categoryFilterActive && this.selectedCategory) {
          await this.getProductsByCategory(this.selectedCategory);
          this.showSnackbar(
            "Sin filtro exitosamente",
            "yellow"
          );
        } else {
          this.selectedCategory = "";
          await this.getProducts();

          // Add snackbar here
          this.showSnackbar(
            "Filtro de categoría cambiado exitosamente.",
            "green"
          );
        }
      } catch (error) {
        this.showSnackbar("Error al cambiar el filtro de categoría.");
        console.error("Error al cambiar el filtro de categoría:", error);
      }
    },
    async createProduct() {
      try {
        if (
          this.newProduct &&
          this.newProduct.nombre &&
          this.newProduct.categoria &&
          this.newProduct.resumen &&
          this.newProduct.descripcion &&
          this.newProduct.imagenArchivo &&
          this.newProduct.precio
        ) {
          console.log(this.newProduct);
          await ProductService.createProduct(this.newProduct);
          const response = await ProductService.getProducts();
          this.products = response.data;
          this.filteredProducts = this.products;
          this.showSnackbar("Producto creado exitosamente.", "green");
          this.isOpenRef.value = false; // Cerrar el modal después de crear el producto
        } else {
          this.showSnackbar("Por favor, rellene todos los campos necesarios.");
        }
        this.createDialog = false;
      } catch (error) {
        this.showSnackbar("Error al crear el producto.");
        console.error("Error al crear el producto:", error);
      }
    },
  },
  watch: {
    categoryFilterActive(newVal, oldVal) {
      if (!newVal && oldVal) {
        this.selectedCategory = null;
        this.getProducts();
      }
    },
  },
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  color: #333;
  background-color: #f3f1f5;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #5400c2;
}

ion-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

ion-col {
  flex: 1 0 21%;
  /* Experimenta con este valor según el número de columnas que desees */
  margin: 10px;
  min-width: 300px;
  /* Establece el ancho mínimo de la tarjeta */
}

ion-card {
  border-radius: 15px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease-in-out;
}

ion-card:hover {
  transform: scale(1.03);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
}

ion-card-title {
  font-weight: bold;
  font-size: 20px;
  color: #5400c2;
}

.flex-container {
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

.card-content {
  flex-grow: 1;
}

ion-card-subtitle {
  font-size: 16px;
  color: #7008f8;
}

ion-card-content {
  padding: 20px;
}

ion-card-text {
  color: #333;
  line-height: 1.5;
}

@media (max-width: 600px) {
  body {
    font-size: 16px;
  }

  h1 {
    font-size: 24px;
  }

  ion-card-title {
    font-size: 18px;
  }

  ion-card-subtitle {
    font-size: 14px;
  }

  ion-col {
    flex: 1 0 100%;
  }
}
</style>
