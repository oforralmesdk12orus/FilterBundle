<?php

namespace Mesd\FilterBundle\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * FilterEntityRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class FilterEntityRepository extends EntityRepository
{
    public function getCategories()
    {
        $queryBuilder = $this->createQueryBuilder('filterEntity');
        $queryBuilder->join('filterEntity.filterAssociation', 'filterAssociation');
        $queryBuilder->groupBy('filterEntity');
        $queryBuilder->having('COUNT(filterAssociation) > 0');
        $queryBuilder->orderBy('filterEntity.name');
        
        return $queryBuilder;
    }
}
