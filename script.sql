SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema agrodata
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `agrodata` ;

-- -----------------------------------------------------
-- Schema agrodata
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `agrodata` DEFAULT CHARACTER SET utf8 ;
SHOW WARNINGS;
USE `agrodata` ;

-- -----------------------------------------------------
-- Table `agrodata`.`agro_estacao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `agrodata`.`agro_estacao` ;

SHOW WARNINGS;  
CREATE TABLE IF NOT EXISTS `agrodata`.`agro_estacao` (
  `id_estacao` INT NOT NULL AUTO_INCREMENT,
  `nm_estacao` VARCHAR(45) NOT NULL,
  `lng_estacao` DOUBLE NOT NULL,
  `lat_estacao` DOUBLE NOT NULL,
  `desc_estacao` VARCHAR(45) NULL,
  PRIMARY KEY (`id_estacao`),
  UNIQUE INDEX `id_sensor_UNIQUE` (`id_estacao` ASC) VISIBLE,
  UNIQUE INDEX `nm_estacao_UNIQUE` (`nm_estacao` ASC) VISIBLE)
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `agrodata`.`agro_dados`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `agrodata`.`agro_dados` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `agrodata`.`agro_dados` (
  `id_dados` INT NOT NULL AUTO_INCREMENT,
  `umidade_dados` DOUBLE NOT NULL,
  `temperatura_dados` DOUBLE NOT NULL,
  `luminosidade_dados` DOUBLE NOT NULL,
  `data_dados` DATETIME NOT NULL,
  `id_estacao` INT NOT NULL,
  UNIQUE INDEX `id_dados_UNIQUE` (`id_dados` ASC) VISIBLE,
  PRIMARY KEY (`id_dados`),
  INDEX `id_estacao_idx` (`id_estacao` ASC) VISIBLE,
  CONSTRAINT `estacao_sensor`
    FOREIGN KEY (`id_estacao`)
    REFERENCES `agrodata`.`agro_estacao` (`id_estacao`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SHOW WARNINGS;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
