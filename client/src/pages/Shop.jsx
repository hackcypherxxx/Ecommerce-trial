import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row container mx-auto">
        {/* Sidebar */}
        <aside className="bg-[#151515] p-3 mt-2 mb-2 md:w-64">
          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">Filter by Categories</h2>
          <div className="p-5">
            {categories?.map((c) => (
              <div key={c._id} className="mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={c._id}
                    onChange={(e) => handleCheck(e.target.checked, c._id)}
                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <label htmlFor={c._id} className="ml-2 text-sm font-medium text-white">
                    {c.name}
                  </label>
                </div>
              </div>
            ))}
          </div>

          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">Filter by Brands</h2>
          <div className="p-5">
            {uniqueBrands?.map((brand) => (
              <div key={brand} className="flex items-center mb-5">
                <input
                  type="radio"
                  id={brand}
                  name="brand"
                  onChange={() => handleBrandClick(brand)}
                  className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500"
                />
                <label htmlFor={brand} className="ml-2 text-sm font-medium text-white">{brand}</label>
              </div>
            ))}
          </div>

          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">Filter by Price</h2>
          <div className="p-5">
            <input
              type="text"
              placeholder="Enter Price"
              value={priceFilter}
              onChange={handlePriceChange}
              className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
            />
          </div>

          <div className="p-5 pt-0">
            <button className="w-full border my-4" onClick={() => window.location.reload()}>
              Reset
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-3 md:p-8">
          <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
          <div className="flex flex-wrap justify-center">
            {products.length === 0 ? (
              <Loader />
            ) : (
              products?.map((p) => (
                <div className="p-3 w-full sm:w-1/2 md:w-1/3 lg:w-1/4" key={p._id}>
                  <ProductCard p={p} />
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Shop;