-- DropForeignKey
ALTER TABLE `coupon_quantity` DROP FOREIGN KEY `coupon_quantity_coupon_id_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_coupon_id_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_item` DROP FOREIGN KEY `order_item_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_item` DROP FOREIGN KEY `order_item_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_quantity` DROP FOREIGN KEY `product_quantity_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_coupon` DROP FOREIGN KEY `user_coupon_coupon_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_coupon` DROP FOREIGN KEY `user_coupon_user_id_fkey`;

-- DropIndex
DROP INDEX `order_coupon_id_fkey` ON `order`;

-- DropIndex
DROP INDEX `order_user_id_fkey` ON `order`;

-- DropIndex
DROP INDEX `order_item_order_id_fkey` ON `order_item`;

-- DropIndex
DROP INDEX `order_item_product_id_key` ON `order_item`;

-- DropIndex
DROP INDEX `user_coupon_coupon_id_fkey` ON `user_coupon`;

-- DropIndex
DROP INDEX `user_coupon_user_id_fkey` ON `user_coupon`;

-- AlterTable
ALTER TABLE `order` ALTER COLUMN `coupon_id` DROP DEFAULT;
