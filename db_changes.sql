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




 CREATE TABLE `credit_note` (
   `id` int NOT NULL AUTO_INCREMENT,
   `credit_date` datetime NOT NULL,
   `shipper_code` varchar(20) NOT NULL,
   `shipper_name` varchar(100) NOT NULL,
   `amount` varchar(20) NOT NULL,
   `pdf_name` varchar(50) DEFAULT NULL,
   `status` varchar(50) NOT NULL DEFAULT 'Pending',
   `payment_due_date` date NOT NULL,
   `amount_paid` varchar(45) DEFAULT '0',
   `payment_method` varchar(45) DEFAULT NULL,
   `paid_on` date DEFAULT NULL,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=436 DEFAULT CHARSET=latin1


 CREATE TABLE `credit_note_details` (
   `id` int NOT NULL AUTO_INCREMENT,
   `credit_note_id` varchar(20) NOT NULL,
   `shipper_code` varchar(20) NOT NULL,
   `amount` varchar(20) NOT NULL,
   `description` varchar(50) NOT NULL DEFAULT 'Pending',
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=436 DEFAULT CHARSET=latin1



 CREATE TABLE `debit_note` (
   `id` int NOT NULL AUTO_INCREMENT,
   `debit_date` datetime NOT NULL,
   `shipper_code` varchar(20) NOT NULL,
   `shipper_name` varchar(100) NOT NULL,
   `amount` varchar(20) NOT NULL,
   `pdf_name` varchar(50) DEFAULT NULL,
   `status` varchar(50) NOT NULL DEFAULT 'Pending',
   `payment_due_date` date NOT NULL,
   `amount_paid` varchar(45) DEFAULT '0',
   `payment_method` varchar(45) DEFAULT NULL,
   `paid_on` date DEFAULT NULL,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=latin1;


 CREATE TABLE `debit_note_details` (
   `id` int NOT NULL AUTO_INCREMENT,
   `debit_note_id` varchar(20) NOT NULL,
   `shipper_code` varchar(20) NOT NULL,
   `amount` varchar(20) NOT NULL,
   `description` varchar(50) NOT NULL,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=436 DEFAULT CHARSET=latin1


 
 
 CREATE TABLE `vendors` (
   `id` int NOT NULL AUTO_INCREMENT,
   `name` varchar(500) NOT NULL,
   `address1` varchar(100) DEFAULT NULL,
   `city` varchar(500) NOT NULL,
   `state` varchar(100) NOT NULL,
   `postcode` varchar(10) NOT NULL,
   `country` varchar(500) NOT NULL,
   `telephone` varchar(20) DEFAULT NULL,
   `mobile` varchar(20) DEFAULT NULL,
   `fax` varchar(20) DEFAULT NULL,
   `email` varchar(50) DEFAULT NULL,
   `contact` varchar(20) DEFAULT NULL,
   `remark` varchar(100) DEFAULT NULL,
   `tax_exclusive` tinyint(1) DEFAULT NULL,
   `manual_rate` tinyint(1) DEFAULT NULL,
   `invoice_format` varchar(10) DEFAULT NULL,
   `credit_limit` varchar(10) DEFAULT NULL,
   `term_day` varchar(10) DEFAULT NULL,
   `acc_bal` decimal(18,2) NOT NULL DEFAULT '0.00',
   `created_on` timestamp NULL DEFAULT NULL,
   `created_by` varchar(20) DEFAULT NULL,
   `changed_on` timestamp NULL DEFAULT NULL,
   `changed_by` varchar(20) DEFAULT NULL,
   `deleted_on` timestamp NULL DEFAULT NULL,
   `deleted_by` varchar(20) DEFAULT NULL,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=latin1


 CREATE TABLE `bill` (
   `id` int NOT NULL AUTO_INCREMENT,
   `vendor_id` int NOT NULL,
   `bill_date` date NOT NULL,
   `amount` varchar(20) NOT NULL,
   `pdf_name` varchar(50) DEFAULT NULL,
   `status` varchar(50) NOT NULL DEFAULT 'Pending',
   `payment_due_date` date NOT NULL,
   `amount_paid` varchar(45) DEFAULT '0',
   `payment_method` varchar(45) DEFAULT NULL,
   `paid_on` date DEFAULT NULL,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB  DEFAULT CHARSET=latin1



 CREATE TABLE `bill_details` (
   `id` int NOT NULL AUTO_INCREMENT,
   `bill_id` varchar(20) NOT NULL,
   `item_name` varchar(45) NOT NULL,
   `expense_category` varchar(45) NOT NULL,
	`description` varchar(50) NOT NULL DEFAULT 'Pending',
	`oty` varchar(50) NOT NULL DEFAULT '0',
    `price` varchar(20) NOT NULL,
	`total_amount` varchar(20) NOT NULL,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=latin1


 
