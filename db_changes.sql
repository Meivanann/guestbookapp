ALTER TABLE `psa`.`shipper_acc_statements` 
ADD COLUMN `description` VARCHAR(45) NULL AFTER `created_on`,
ADD COLUMN `bal` VARCHAR(45) NULL AFTER `description`;


ALTER TABLE `psa`.`invoice` 
ADD COLUMN `payment_method` VARCHAR(45) NULL AFTER `consignment_end_date`,
ADD COLUMN `paid_on` DATE NULL AFTER `payment_method`;


ALTER TABLE `psa`.`shipper_acc_statements` 
CHANGE COLUMN `created_on` `created_on` DATE NOT NULL ;



CREATE TABLE `account_statements` (
   `id` int NOT NULL AUTO_INCREMENT,
   `type` varchar(50) NOT NULL,
   `account` varchar(50) NOT NULL,
   `amount` decimal(18,2) NOT NULL DEFAULT '0.00',
   `created_on` date NOT NULL,
   `description` varchar(45) DEFAULT NULL,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1