import LoadingComponent from "../../app/layout/LoadingComponent";
import ProductList from "./ProductList";
import { useGetProductsQuery } from "./catalogApi";

export default function Catalog() {
  const { data, isLoading } = useGetProductsQuery();

  if (isLoading || !data) return <LoadingComponent message="Fetching Product..." />;
  return <ProductList products={data} />;
}