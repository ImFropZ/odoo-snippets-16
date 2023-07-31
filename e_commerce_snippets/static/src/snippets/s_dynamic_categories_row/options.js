/** @odoo-module **/

import options from "web_editor.snippets.options";
import wUtils from "website.utils";
import core from "web.core";

const QWeb = core.qweb;

options.registry.DynamicCategoriesRowOptions = options.Class.extend({
  start() {
    const categoriesRowContainer = this.$target.find(
      "#dynamic_cateogories_row_container"
    );

    if (categoriesRowContainer) {
      // Search domain setup
      var websiteIdDomain = wUtils.websiteDomain(this);
      var domain = [...websiteIdDomain];

      this._rpc({
        route: "/e_commerce/get_product_categories_row",
        params: {
          domain,
        },
      }).then((data) => {
        categoriesRowContainer.html(
          QWeb.render("e_commerce_snippets.CategoryRow", {
            categoryRows: data,
          })
        );
      });

      const moveBackBtn = $(".dynamic_category_row_products__moveBack");
      const moveFrontBtn = $(".dynamic_category_row_products__moveFront");

      moveBackBtn.on("click", function () {
        const container = $(this).siblings(
          ".dynamic_category_row_productsContainer"
        );
        const nextSectionOffset = container.scrollLeft() - container.width();

        container.animate({ scrollLeft: nextSectionOffset }, "slow");
      });

      moveFrontBtn.on("click", function () {
        const container = $(this).siblings(
          ".dynamic_category_row_productsContainer"
        );
        const nextSectionOffset = container.scrollLeft() + container.width();

        container.animate({ scrollLeft: nextSectionOffset }, "slow");
      });
    }
  },
});

export default {
  DynamicCategoriesRowOptions: options.registry.DynamicCategoriesRowOptions,
};
