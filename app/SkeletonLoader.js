import React from "react";
import ContentLoader, { Rect } from "react-content-loader/native";

const SkeletonLoader = () => (
  <ContentLoader
    speed={2}
    width={"100%"}
    height={150}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{ marginVertical: 10, marginHorizontal: 20 }}
  >
    <Rect x="0" y="0" rx="10" ry="10" width="100" height="150" />
    <Rect x="120" y="10" rx="5" ry="5" width="220" height="20" />
    <Rect x="120" y="40" rx="5" ry="5" width="180" height="20" />
    <Rect x="120" y="70" rx="5" ry="5" width="150" height="20" />
    <Rect x="120" y="100" rx="5" ry="5" width="100" height="20" />
    <Rect x="120" y="130" rx="5" ry="5" width="80" height="20" />
  </ContentLoader>
);

export default SkeletonLoader;
