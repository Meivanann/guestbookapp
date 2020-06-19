ALTER TABLE `psa`.`shipper_acc_statements` 
ADD COLUMN `description` VARCHAR(45) NULL AFTER `created_on`,
ADD COLUMN `bal` VARCHAR(45) NULL AFTER `description`;


