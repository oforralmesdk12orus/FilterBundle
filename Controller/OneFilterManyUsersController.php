<?php

namespace Mesd\FilterBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Mesd\FilterBundle\Form\Type\OneFilterManyUsersType;

/**
 * One Filter Many Users controller.
 *
 */
class OneFilterManyUsersController extends Controller
{
    /**
     * Lists all Filter entities.
     *
     */
    public function indexAction()
    {
        $entityManager = $this->getDoctrine()->getManager();

        $filterClass = $this->container->getParameter('mesd_filter.filter_class');
        $filterRepository = $entityManager->getRepository($filterClass);
        $filters = $filterRepository->findAll();

        return $this->render('MesdFilterBundle:OneFilterManyUsers:index.html.twig', array(
            'entities' => $filters,
        ));
    }

    /**
     * Finds and displays a Filter entity.
     *
     */
    public function showAction($id)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $filterClass = $this->container->getParameter('mesd_filter.filter_class');
        $filterRepository = $entityManager->getRepository($filterClass);
        $entity = $filterRepository->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Filter entity.');
        }

        return $this->render('MesdFilterBundle:OneFilterManyUsers:show.html.twig', array(
            'entity'      => $entity,
        ));
    }

    /**
     * Displays a form to edit an existing Filter entity.
     *
     */
    public function editAction($id)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $filterClass = $this->container->getParameter('mesd_filter.filter_class');
        $userClass = $this->container->getParameter('mesd_filter.user_class');
        $filterRepository = $entityManager->getRepository($filterClass);
        $entity = $filterRepository->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Filter entity.');
        }

        $editForm = $this->createEditForm($entity, $filterClass, $userClass);

        return $this->render('MesdFilterBundle:OneFilterManyUsers:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
        ));
    }

    /**
    * Creates a form to edit a Filter entity.
    *
    * @param Filter $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createEditForm($entity, $filterClass, $userClass, $queryBuilder = null)
    {
        $form = $this->createForm(new OneFilterManyUsersType($filterClass, $userClass), $entity, array(
            'action' => $this->generateUrl('MesdFilterBundle_onefiltermanyusers_update', array('id' => $entity->getId())),
            'method' => 'PUT',
        ));

        $form->add('submit', 'submit', array('label' => 'Update'));

        return $form;
    }

    /**
     * Edits an existing Filter entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $filterClass = $this->container->getParameter('mesd_filter.filter_class');
        $userClass = $this->container->getParameter('mesd_filter.user_class');
        $filterRepository = $entityManager->getRepository($filterClass);
        $entity = $filterRepository->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Filter entity.');
        }

        $editForm = $this->createEditForm($entity, $filterClass, $userClass);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $entityManager->flush();

            return $this->redirect($this->generateUrl('MesdFilterBundle_onefiltermanyusers_show', array('id' => $id)));
        }

        return $this->render('MesdFilterBundle:OneFilterManyUsers:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
        ));
    }
}
