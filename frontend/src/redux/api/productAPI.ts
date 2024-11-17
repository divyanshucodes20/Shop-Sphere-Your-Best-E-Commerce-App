import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AllProductsResponse, CategoriesResponse, DeleteProductRequest, MessageResponse, NewProductRequest, ProductResponse, SearchProductsRequest, SearchProductsResponse, UpdateProductRequest } from "../../types/api-types"



export const prodctAPI=createApi({reducerPath:"prodcuctApi",baseQuery:fetchBaseQuery({baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/product/`}),
tagTypes:["product","allProducts"],
endpoints:(builder)=>({
    latestProducts:builder.query<AllProductsResponse,string>({query:()=>"latest",providesTags:["product","allProducts"]}),

    allProducts:builder.query<AllProductsResponse,string>({query:(id)=>`admin-products?id=${id}`,providesTags:["product","allProducts"]}),

    categories:builder.query<CategoriesResponse,string>({query:()=>`categories`,providesTags:["product","allProducts"]}),

    searchProducts:builder.query<SearchProductsResponse,SearchProductsRequest>({query:({price,search,sort,category,page})=>{
        
        let base=`all?search=${search}&page=${page}`
        if(price) base+=`&price=${price}`;
        if(sort) base+=`&sort=${sort}`;
        if(category) base+=`&category=${category}`;
        
        return base;
    },
    providesTags:["product","allProducts"]
}),
    productDetails:builder.query<ProductResponse,string>({
    query:(id)=>`${id}`,
    providesTags:["product"]
    }),
    newProduct:builder.mutation<MessageResponse,NewProductRequest>({query:({formData,id})=>({
        url: `new?id=${id}`,
        method: "POST",
        body: formData
    }),
    invalidatesTags:["product","allProducts"]
}),
updateProduct:builder.mutation<MessageResponse,UpdateProductRequest>({
    query:({userId,productId,formData})=>({
        url:`${productId}?id=${userId}`,
        method:"PUT",
        body:formData
    }),
    invalidatesTags:["product","allProducts"]
}),
deleteProduct:builder.mutation<MessageResponse,DeleteProductRequest>({
    query:({productId,userId})=>({
        url:`${productId}?id=${userId}`,
        method:"DELETE"
    }),
    invalidatesTags:["allProducts"]
})
})
})


export const { useLatestProductsQuery,useAllProductsQuery,useCategoriesQuery,useSearchProductsQuery,useNewProductMutation,useProductDetailsQuery,useUpdateProductMutation,useDeleteProductMutation }=prodctAPI