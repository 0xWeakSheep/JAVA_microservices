DROP DATABASE IF EXISTS dept8001 ;
CREATE DATABASE dept8001 CHARACTER SET UTF8 ;
USE dept8001 ;
CREATE TABLE dept(
     deptno    bigint  auto_increment ,
     dname     varchar(50) ,
     loc       varchar(50) ,
     constraint pk_deptno primary key(deptno)
) engine=innodb ;
INSERT INTO dept(dname,loc) VALUES ('财务部-8001','北京') ;
INSERT INTO dept(dname,loc) VALUES ('开发部-8001','石家庄') ;
INSERT INTO dept(dname,loc) VALUES ('销售部-8001','上海') ;
INSERT INTO dept(dname,loc) VALUES ('产品部-8001','广州') ;
INSERT INTO dept(dname,loc) VALUES ('人事部-8001','深圳') ;