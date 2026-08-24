import gradio as gr
from diffusers import StableDiffusionPipeline, AnimateDiffPipeline, DDIMScheduler
import torch
from PIL import Image

# Charger le modèle IA gratuit pour les images
print("Chargement de SunuAI... patience 1 min")
pipe_image = StableDiffusionPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    torch_dtype=torch.float16
)
pipe_image = pipe_image.to("cpu") # On force CPU pour que ça marche sur tel

def generer_image(prompt):
    """Génère une image à partir de texte"""
    if prompt == "":
        return None
    image = pipe_image(prompt, num_inference_steps=20).images[0]
    return image

# Interface Gradio
with gr.Blocks(title="SunuAI") as demo:
    gr.Markdown("# 🇸🇳 SunuAI \n **Notre IA à nous.** Génère des images et vidéos gratuitement.")

    with gr.Tab("🖼️ Générer Image"):
        with gr.Row():
            prompt = gr.Textbox(label="Décris ton image", placeholder="ex: un lion avec un boubou à Thiès au coucher du soleil")
            btn = gr.Button("Générer", variant="primary")
        output_image = gr.Image(label="Résultat")
        btn.click(fn=generer_image, inputs=prompt, outputs=output_image)

    with gr.Tab("🎬 Générer Vidéo"):
        gr.Markdown("Bientôt disponible dans la v2! Pour l'instant on fait des images.")

demo.launch(share=True)
