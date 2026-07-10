@router.get("/{site_id}", response_model=schemas.SiteOut)
def get_site(
    project_id: str,
    site_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    
    _get_owned_project(project_id, db, current_user)
    
   
    site = db.query(models.Site).filter(
        models.Site.id == site_id, 
        models.Site.project_id == project_id
    ).first()
    
    
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
        
    return site